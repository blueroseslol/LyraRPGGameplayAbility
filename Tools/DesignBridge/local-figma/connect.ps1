$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$runtime = Join-Path $projectRoot 'Saved\DesignBridge\local-figma\bin\figma-local.mjs'
$session = Join-Path $projectRoot 'Saved\DesignBridge\local-session'
if (-not (Test-Path -LiteralPath $runtime)) { throw 'Install the pinned local-figma checkout described in the documentation first' }
Push-Location $session
try {
    & node $runtime doctor
    if ($LASTEXITCODE -eq 0) { return }
    # Do not replace a running bridge or its pairing credentials.
    if (Test-Path -LiteralPath '.figma-agent\session.json') { throw 'A bridge session already exists. Inspect doctor/status before restarting it.' }
    & node $runtime connect
} finally { Pop-Location }
