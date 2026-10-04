param(
    [Parameter(Mandatory=$true)][string]$Package,
    [string]$Engine = 'D:\UnrealEngine\UE_5.8',
    [switch]$NoCapture
)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$packageRoot = (Resolve-Path -LiteralPath $Package).Path
& node (Join-Path $PSScriptRoot 'cli.mjs') verify-runtime --package $packageRoot
if ($LASTEXITCODE -ne 0) { throw 'Package validation failed' }
if (-not (Test-Path -LiteralPath (Join-Path $packageRoot 'runtime.json'))) { throw 'Run generate before importing' }
$previousPackage = $env:DESIGNBRIDGE_PACKAGE
$previousCapture = $env:DESIGNBRIDGE_CAPTURE
$previousRun = $env:DESIGNBRIDGE_RUN_ID
try {
    $env:DESIGNBRIDGE_RUN_ID = [guid]::NewGuid().ToString()
    $env:DESIGNBRIDGE_PACKAGE = $packageRoot
    $env:DESIGNBRIDGE_CAPTURE = if ($NoCapture) { '0' } else { '1' }
    $renderer = if ($NoCapture) { '-NullRHI' } else { '-RenderOffscreen' }
    $argsForUE = @((Join-Path $projectRoot 'LyraStarterGame.uproject'),
        "-ExecutePythonScript=$(Join-Path $PSScriptRoot 'ue\import_package.py')", '-EnablePlugins=PythonScriptPlugin,DesignBridgeEditor',
        $renderer, '-AllowCommandletRendering', '-unattended', '-nosplash', '-nosound', '-nop4', '-NoLiveCoding',
        "-abslog=$(Join-Path $packageRoot 'ue-import.log')")
    & (Join-Path $Engine 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe') @argsForUE
    if ($LASTEXITCODE -ne 0) { throw "UE import failed with exit code $LASTEXITCODE" }
    $report = Get-Content -LiteralPath (Join-Path $packageRoot 'ue-import-report.json') -Raw | ConvertFrom-Json
    if (-not $report.ok -or $report.runId -ne $env:DESIGNBRIDGE_RUN_ID) { throw 'UE did not confirm this run succeeded' }
    $report | ConvertTo-Json -Depth 8
} finally {
    $env:DESIGNBRIDGE_PACKAGE = $previousPackage
    $env:DESIGNBRIDGE_CAPTURE = $previousCapture
    $env:DESIGNBRIDGE_RUN_ID = $previousRun
}
