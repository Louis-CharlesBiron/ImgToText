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
$verisonedFiles = @("$bins\createProjectTemplate.js")

#UPDATE VERSIONED FILES
foreach ($filepath in $verisonedFiles) {
(Get-Content $filepath) -replace '"imgtotext": "\^.*?"', @"
`"imgtotext`": `"^$version`"
"@ | Set-Content $filepath
}

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

    $content = Get-Content ($fullPaths | Where-Object {(Split-Path $_ -Leaf) -eq $orderPath}) -Raw -Encoding UTF8
    $mergedCode += "$content`n"
    $mergedCodeESM += "$($content -replace "class $className", "export class $className")`n"
}
$UMDCJSClasses = $UMDCJSClasses.TrimEnd(",")
$mergedCode = "'use strict';`n$($mergedCode.Trim())"
$mergedCodeESM = "import{CDEUtils,FPSCounter,CanvasUtils,Color,_HasColor,GridAssets,TypingDevice,Mouse,Render,TextStyles,RenderStyles,Canvas,Anim,_BaseObj,AudioDisplay,ImageDisplay,TextDisplay,_DynamicColor,Pattern,_Obj,Shape,Gradient,FilledShape,Grid,Dot}from'cdejs';$($mergedCodeESM.Trim())"


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
$minifiedCode = Get-Content $minifiedCodePathUMD -Raw -Encoding UTF8

#GET AND FORMAT CDE DEPENDENCY CODE
$rawDependencyCode = (Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Louis-CharlesBiron/canvasDotEffect/main/dist/canvasDotEffect.min.js" -UseBasicParsing).Content.Trim()
$classesDelimiter = "return{"
$UMDWrapper2ndSectionStart = $rawDependencyCode.LastIndexOf($classesDelimiter)
$UMDWrapper1stSectionEnd = 280
$minifiedDependencyCode = $rawDependencyCode.Substring($UMDWrapper1stSectionEnd, ($UMDWrapper2ndSectionStart-$UMDWrapper1stSectionEnd))
$dependencyUMDCJSClasses = $rawDependencyCode.Substring($UMDWrapper2ndSectionStart+$classesDelimiter.Length, $rawDependencyCode.Length-($UMDWrapper2ndSectionStart+$classesDelimiter.Length)-4)

Set-Content -Path $minifiedCodePathUMD -Value @"
// ImgToText UMD - v$version
(function(factory){if(typeof define==="function"&&define.amd)define([],factory);else if(typeof module==="object"&&module.exports)module.exports=factory();else if(typeof window!=="undefined"){const{CDE,ImgToText}=factory();window.CDE=CDE;window.ImgToText=ImgToText}else{const{CDE,ImgToText}=factory();this.CDE=CDE;this.ImgToText=ImgToText}})(function(){$minifiedDependencyCode;$minifiedCode;return{ImgToText:{$UMDCJSClasses},CDE:{$dependencyUMDCJSClasses}}})
"@ -Encoding UTF8

#ADD VERSION COMMENT TO ESM
Set-Content -Path $minifiedCodePathESM -Value "// ImgToText ESM - v$version`n$(Get-Content $minifiedCodePathESM -Raw -Encoding UTF8)"

#MINIFY BINS FILES
$binFiles = @("global.js", "createProjectTemplate.js", "createBrowserProjectTemplate.js", "openDocumentation.js")
foreach ($filepath in $binFiles) {
    $filepath = "$bins\$filepath"
    Start-Process -FilePath $terser -ArgumentList "$filepath -o $bins\$((Get-Item $filepath).BaseName).min.js --compress --mangle"
}