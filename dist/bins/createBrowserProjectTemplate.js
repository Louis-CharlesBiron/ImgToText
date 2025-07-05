#!/usr/bin/env node
import {mkdirSync, copyFileSync, writeFileSync} from "fs"
import {join, dirname} from "path"
import {fileURLToPath} from "url"
import {createInterface} from "readline"
import {exec} from "child_process"

const destination = join(process.cwd(), process.argv[2]||""),
      mediaDest = join(destination, "medias"),
      libPath = join(dirname(fileURLToPath(import.meta.url)), "../imgToText.min.js")

// Create folders
try {
    mkdirSync(destination, {recursive:true})
    mkdirSync(mediaDest)
} catch {}

// Create imgToText.min.js
copyFileSync(libPath, join(destination, "imgToText.min.js"))

// Create index.html
writeFileSync(join(destination, "index.html"), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <textarea id="generatedText" autocomplete="off" spellcheck="false"></textarea>

    <div class="settings">
        <button id="copyResult">Copy Text Result</button>
        <button id="inputCamera">Camera</button>
        <button id="inputScreen">Screen</button>
        <input type="file" id="mediaInput">
    </div>

    <script src="imgToText.min.js"></script>
    <script src="index.js" async></script>
</body>
</html>`)

// Create index.css
writeFileSync(join(destination, "index.css"), `html, body {
    background-color: black;
    overflow: hidden;
    color: aliceblue;
    margin: 0;
    font-size: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#generatedText {
    height: 95%;
    width: 100%;
    background-color: transparent;
    color: aliceblue;
    outline: none;
    border: none;
    font-family: monospace;
    font-size: 16px;
    letter-spacing: 0px;
    line-height: 18px;
    white-space: nowrap;
}`)

// Create index.js
writeFileSync(join(destination, "index.js"), `const {ImageToTextConverter} = window.ImgToText, 
      {ImageDisplay} = window.CDE

// The ImageToTextConverter instance
const converter = new ImageToTextConverter((text)=>{ generatedText.value = text }, null, null, 3)

// Some default text
converter.createBigText("Img\nTo\nText :D", "32px monospace", [2, 1.25])

// Custom file input
converter.createHTMLFileInput(mediaInput)

// Camera capture input
inputCamera.onclick=()=>{
    converter.loadMedia(ImageDisplay.loadCamera())
    mediaInput.value = ""
}

// Sreen capture input
inputScreen.onclick=()=>{
    converter.loadMedia(ImageDisplay.loadCapture())
    mediaInput.value = ""
}

// Copy text result
copyResult.onclick=()=>{
    if (navigator.clipboard) navigator.clipboard.writeText(generatedText.value.trimEnd())
    generatedText.select()
    generatedText.setSelectionRange(0, 999999)
}`)


console.log("Browser project template successfully created at '"+destination+"'!\n")

const cli = createInterface({input:process.stdin, output:process.stdout})
function close(cli) {
    cli.close()
    console.log("")
}

cli.question("Open in explorer [Y/N]?  ", value=>{
    const v = value?.toLowerCase()?.trim()
    if (v=="code") exec("code --new-window "+destination)
    else if (!v || ["y", "yes", "ye", "ok"].includes(v)) exec("explorer "+destination)
    close(cli)
})

process.stdin.on("keypress", (_, key) => {
    if (key.name == "escape") close(cli)
})