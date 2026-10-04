param([Parameter(Mandatory=$true)][string]$Package, [string]$Engine = 'D:\UnrealEngine\UE_5.8', [string]$Component)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$packageRoot = (Resolve-Path -LiteralPath $Package).Path
& node (Join-Path $PSScriptRoot 'cli.mjs') verify-runtime --package $packageRoot
if ($LASTEXITCODE -ne 0) { throw 'Package validation failed' }
& node (Join-Path $projectRoot 'TypeScript\node_modules\typescript\lib\tsc.js') --project (Join-Path $PSScriptRoot 'tsconfig.runtime.json')
if ($LASTEXITCODE -ne 0) { throw 'TypeScript compile failed' }
$oldVerify = $env:DESIGNBRIDGE_VERIFY
$oldRun = $env:DESIGNBRIDGE_RUN_ID
$oldComponent = $env:DESIGNBRIDGE_COMPONENT
try {
    $env:DESIGNBRIDGE_VERIFY = $packageRoot
    $env:DESIGNBRIDGE_RUN_ID = [guid]::NewGuid().ToString()
    $env:DESIGNBRIDGE_COMPONENT = $Component
    & (Join-Path $Engine 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe') (Join-Path $projectRoot 'LyraStarterGame.uproject') /Engine/Maps/Entry -EnablePlugins=DesignBridgeEditor -RenderOffscreen -unattended -nosplash -nosound -nop4 -NoLiveCoding "-abslog=$(Join-Path $packageRoot 'ue-runtime.log')"
    if ($LASTEXITCODE -ne 0) { throw "UE failed: $LASTEXITCODE" }
    $report = Get-Content -LiteralPath (Join-Path $packageRoot 'ue-runtime-report.json') -Raw | ConvertFrom-Json
    if (-not $report.ok -or $report.runId -ne $env:DESIGNBRIDGE_RUN_ID) { throw "Runtime verification failed: $($report.error)" }
    $report | ConvertTo-Json -Depth 10
} finally { $env:DESIGNBRIDGE_VERIFY = $oldVerify; $env:DESIGNBRIDGE_RUN_ID = $oldRun; $env:DESIGNBRIDGE_COMPONENT = $oldComponent }
