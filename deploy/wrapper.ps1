<#
    THIS IS THE SOURCE CODE OF WRAPPER.EXE
#>

#GET LOCATIONS
$at = Get-Location
$root = Split-Path -Path $at -Parent
$dist = "$root\dist"
$bins = "$root\dist\bins"
$deploy = "$root\deploy"
$terser = "$deploy\node_modules\.bin\terser"
$version = (Get-Content "$dist\package.json" | ConvertFrom-Json).version

# UPDATE DIST README
Copy-Item "$root\readme.md" -Destination "$dist\readme.md" -Force

#GET CONFIG
$c = Get-Content "$at\deployConfig.json" | ConvertFrom-Json

#GET ALL SRC FILES
$fullPaths = Get-ChildItem "$root\src" -File -Recurse | ForEach-Object {$_.FullName}

#MERGE ALL CODE IN ORDER
$mergedCode = ""
$mergedCodeESM = ""
$UMDCJSClasses = ""
$c.wrapOrder.split(" ") | ForEach-Object {
    $orderPath = $_
    $className = $_ -replace "\.js$", ""

    $UMDCJSClasses += "$className,"

    $content = Get-Content ($fullPaths | Where-Object {(Split-Path $_ -Leaf) -eq $orderPath}) -Raw
    $mergedCode += "$content`n"
    $mergedCodeESM += "$($content -replace "class $className", "export class $className")`n"
}
$mergedCode = "'use strict';$($mergedCode.Trim())"
$mergedCodeESM = "import{ImageDisplay,Canvas,CDEUtils}from'cdejs';$($mergedCodeESM.Trim())"


#CREATE MERGED FILE
$toMinifyPath = New-Item "$dist\imgToText.js" -Value $mergedCode -Force
$toMinifyPathESM = New-Item "$dist\imgToTextESM.js" -Value $mergedCodeESM -Force

#CREATE MINIFIED MERGED FILE
if (-not (Test-Path $terser)) {
    Set-Location $deploy
    npm ci
    Set-Location $at
}

#MINIFY LIBRARY FILES
$minifiedCodePathUMD = "$dist\imgToText.min.js"
$minifiedCodePathESM = "$dist\imgToText.esm.js"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPathESM -o $minifiedCodePathESM --compress"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPath -o $minifiedCodePathUMD --compress" -wait

#ADD UMD VERSION AND VERSION COMMENT
$minifiedCode = Get-Content $minifiedCodePathUMD -Raw
$minifiedDependencyCode = (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Louis-CharlesBiron/canvasDotEffect/main/dist/canvasDotEffect.min.js" -UseBasicParsing).Content

Set-Content -Path $minifiedCodePathUMD -Value @"
// ImgToText UMD - v$version
(function(factory){if(typeof define==="function"&&define.amd)define([],factory);else if(typeof module==="object"&&module.exports)module.exports=factory();else if(typeof window!=="undefined")window.ImgToText=factory();else this.ImgToText=factory()})(function(){$minifiedDependencyCode;$minifiedCode;return{$UMDCJSClasses}})
"@

#ADD VERSION COMMENT TO ESM
Set-Content -Path $minifiedCodePathESM -Value "// ImgToText ESM - v$version`n$(Get-Content $minifiedCodePathESM -Raw)"

#MINIFY BINS FILES
$binFiles = @("global.js", "bigText.js")
foreach ($filepath in $binFiles) {
    $filepath = "$bins\$filepath"
    Start-Process -FilePath $terser -ArgumentList "$filepath -o $bins\$((Get-Item $filepath).BaseName).min.js --compress --mangle"
}