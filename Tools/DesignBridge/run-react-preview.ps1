param([string]$Engine = 'D:\UnrealEngine\UE_5.8', [switch]$VerifyOnly)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$packageRoot = Join-Path $projectRoot 'Saved\DesignBridge\genshin_cover'
& node (Join-Path $projectRoot 'Plugins\ReactUMG\Tools\DesignBridge\cli.mjs') verify-runtime --package $packageRoot
if ($LASTEXITCODE -ne 0) { throw 'Source package validation failed' }
& node (Join-Path $projectRoot 'TypeScript\node_modules\typescript\lib\tsc.js') --project (Join-Path $PSScriptRoot 'tsconfig.runtime.json')
if ($LASTEXITCODE -ne 0) { throw 'TypeScript compile failed' }
$oldPreview = $env:DESIGNBRIDGE_REACT_PREVIEW
$oldVerify = $env:DESIGNBRIDGE_REACT_VERIFY
$oldRun = $env:DESIGNBRIDGE_RUN_ID
try {
    $env:DESIGNBRIDGE_REACT_PREVIEW = $packageRoot
    $env:DESIGNBRIDGE_REACT_VERIFY = if ($VerifyOnly) { '1' } else { '0' }
    $env:DESIGNBRIDGE_RUN_ID = [guid]::NewGuid().ToString()
    $launchArgs = @((Join-Path $projectRoot 'LyraStarterGame.uproject'), '/Engine/Maps/Entry', '-EnablePlugins=DesignBridgeEditor', '-nosplash', '-nosound', '-nop4', '-NoLiveCoding', "-abslog=$(Join-Path $packageRoot 'react-preview.log')")
    if ($VerifyOnly) { $launchArgs += @('-RenderOffscreen', '-unattended') }
    & (Join-Path $Engine 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe') @launchArgs
    if ($LASTEXITCODE -ne 0) { throw "UE exited with $LASTEXITCODE" }
    $report = Get-Content -LiteralPath (Join-Path $packageRoot 'react-preview-report.json') -Raw | ConvertFrom-Json
    if (-not $report.ok -or $report.runId -ne $env:DESIGNBRIDGE_RUN_ID) { throw "React preview failed: $($report.error)" }
    $report | ConvertTo-Json -Depth 8
} finally {
    $env:DESIGNBRIDGE_REACT_PREVIEW = $oldPreview
    $env:DESIGNBRIDGE_REACT_VERIFY = $oldVerify
    $env:DESIGNBRIDGE_RUN_ID = $oldRun
}
