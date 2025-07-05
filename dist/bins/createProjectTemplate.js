#!/usr/bin/env node
import {exec, spawn} from "child_process"
import {mkdirSync, writeFileSync} from "fs"
import {join} from "path"
import {createInterface} from "readline"

const destination = join(process.cwd(), process.argv[2]||"")

// Create folders
try {
    mkdirSync(destination, {recursive:true})
    mkdirSync(mediaDest)
    mkdirSync(binDest)
} catch {}

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

    <script src="index.js" type="module" async></script>
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
writeFileSync(join(destination, "index.js"), `import {ImageToTextConverter} from "imgtotext"
import {ImageDisplay} from "cdejs"

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

// Create .gitignore
writeFileSync(join(destination, ".gitignore"), `node_modules
dist`)

// Create package.json
writeFileSync(join(destination, "package.json"), `{
    "name": "template",
    "version": "1.0.0",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "dev": "vite"
    },
    "dependencies": {
      "imgtotext": "^1.1.0"
    },
    "devDependencies": {
      "vite": "^6.2.2"
    }
  }`)


spawn("npm", ["i"], {cwd:destination, shell:true})

console.log("Project template successfully created at '"+destination+"'!\n")

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
