param([string]$Engine = 'D:\UnrealEngine\UE_5.8')
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$source = Join-Path $projectRoot 'Plugins\DesignBridgeEditor'
$hostRoot = Join-Path $projectRoot 'Saved\DesignBridge\PluginBuild\HostProject'
$hostPlugin = Join-Path $hostRoot 'Plugins\DesignBridgeEditor'
New-Item -ItemType Directory -Path $hostPlugin -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $source 'DesignBridgeEditor.uplugin') -Destination $hostPlugin
Copy-Item -LiteralPath (Join-Path $source 'Source') -Destination $hostPlugin -Recurse -Force
$hostProject = Join-Path $hostRoot 'HostProject.uproject'
'{ "FileVersion": 3, "Plugins": [ { "Name": "DesignBridgeEditor", "Enabled": true } ] }' | Set-Content -LiteralPath $hostProject -Encoding utf8
$dotnet = Join-Path $Engine 'Engine\Binaries\ThirdParty\DotNet\10.0\win-x64\dotnet.exe'
$ubt = Join-Path $Engine 'Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.dll'
& $dotnet $ubt UnrealEditor Win64 Development "-Project=$hostProject" "-plugin=$(Join-Path $hostPlugin 'DesignBridgeEditor.uplugin')" -NoUBA -NoUBTMakefiles -precompile
if ($LASTEXITCODE -ne 0) { throw "Editor plugin build failed: $LASTEXITCODE" }
$destination = Join-Path $source 'Binaries\Win64'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
Copy-Item -Path (Join-Path $hostPlugin 'Binaries\Win64\*') -Destination $destination -Force
