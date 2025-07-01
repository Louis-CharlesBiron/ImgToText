<#
    THIS IS THE SOURCE CODE OF WRAPPER.EXE
#>

#GET LOCATIONS
$at = Get-Location
$root = Split-Path -Path $at -Parent
$dist = "$root\dist"
$deploy = "$root\deploy"
$terser = "$deploy\node_modules\.bin\terser"

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
$UMDJSClasses = ""
$c.wrapOrder.split(" ") | ForEach-Object {
    $orderPath = $_
    $className = $_ -replace "\.js$", ""

    $UMDCJSClasses += "$className,"
    $UMDJSClasses += "window.$className=$className;"

    $content = Get-Content ($fullPaths | Where-Object {(Split-Path $_ -Leaf) -eq $orderPath}) -Raw
    $mergedCode += "$content`n"
    $mergedCodeESM += "$($content -replace "class $className", "export class $className")`n"
}
$mergedCode.Trim()
$mergedCodeESM.Trim()

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
Start-Process -FilePath $terser -ArgumentList "$toMinifyPathESM -o $dist\imgToText.esm.js --compress"
Start-Process -FilePath $terser -ArgumentList "$toMinifyPath -o $minifiedCodePathUMD --compress" -wait

#ADD UMD WRAPPER
$minifiedCode = Get-Content -Path $minifiedCodePathUMD -Raw
Set-Content -Path $minifiedCodePathUMD -Value @"
(function(factory){typeof define=="function"&&define.amd?define(factory):factory()})((function(){"use strict";$minifiedCode;const classes={$UMDCJSClasses};if(typeof window!=="undefined"){window.ImgToText=classes}else if(typeof module!=="undefined"&&module.exports)module.exports=classes}))
"@