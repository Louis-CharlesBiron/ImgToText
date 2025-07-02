[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Louis-CharlesBiron/ImgToText?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FImgToText%2Fcommits%2Fmain%2F&label=Commit%20Activity)](https://github.com/Louis-CharlesBiron/ImgToText/commits/main/)
[![GitHub last commit](https://img.shields.io/github/last-commit/Louis-CharlesBiron/ImgToText?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FImgToText%2Fcommits%2Fmain%2F&label=Last%20Commit)](https://github.com/Louis-CharlesBiron/ImgToText/commits/main/)
[![NPM Version](https://img.shields.io/npm/v/imgtotext?label=Version&color=%237761c0)](https://www.npmjs.com/package/imgtotext)
[![NPM Downloads](https://img.shields.io/npm/d18m/imgtotext?label=NPM%20Downloads&color=%231cc959)](https://www.npmjs.com/package/imgtotext)
![GitHub Created At](https://img.shields.io/github/created-at/Louis-CharlesBiron/ImgToText?label=Since&color=orange)
![NPM License](https://img.shields.io/npm/l/imgtotext?label=License&color=cadetblue)

# ImgToText

**ImgToText is a concise library that converts any image/video into customizable text.**

# Table of Contents

- [Getting Started](#getting-started)
- [ImageToTextConverter Class](#imagetotextconverter)
- [Visual Examples](#visual-examples)
- [Npx commands](#npx-commands)
- [Credits](#credits)



## Getting Started

1. **Get the library file. (`npm install imgtotext` or [imgToText.min.js](https://github.com/Louis-CharlesBiron/ImgToText/blob/main/dist/imgToText.min.js))** 
```HTML
    <!-- Only if you're using the browser version! Otherwise use: import {...} from "imgtotext" -->
    <script src="ImgToText.min.js"></script>
    TODO
```

2. **In a JS file, create a new ImageToTextConverter instance.**
```js
    // Converts the image at "someImg.png" and logging it in the console
    const converter = new ImageToTextConverter((text)=>console.log(text), "someImg.png")
```
#

# [ImageToTextConverter](#table-of-contents)

The ImageToTextConverter class allows the full convertion and customization of images/videos to text.
#### **The constructor takes the following parameters:**
###### - `new ImageToTextConverter(resultCB, sourceMedia?, maxMediaInputSize?, pxGroupingSize?, charSet?, maxRefreshRate?)`
- **resultCB** -> A callback called on each convertion, its only parameter is the text result of the latest convertion . `(text)=>{...}`
- **sourceMedia**? -> The image/video to convert. One of [`ImageDisplay.SOURCE_TYPES`](https://github.com/Louis-CharlesBiron/canvasDotEffect?tab=readme-ov-file#table-of-contents).
- **maxMediaInputSize**? -> The canvas or canvas size on which medias will be drawn. Either a size array *`[width, height]`*, a *`HTMLCanvasElement`* (to see medias before convertion), a *`OffscreenCanvas`*, or a [*cdejs `Canvas`*](https://github.com/Louis-CharlesBiron/canvasDotEffect?tab=readme-ov-file#table-of-contents). Defaults to about `[3840, 2160]`.
- **pxGroupingSize**? -> The pixel output resolution. E.g: `1` converts pixels to characters at a 1:1 ratio (one character per media pixel), and `5` converts pixels to chars at a 25:1 ratio (one character per 5x5 pixels of the original media). Defaults to `5`.
- **charSet**? -> The characters used to draw the image using text, going from least visible to most visible. Either a `String` or an `Array`. Defaults to `[" ", ".", ":", "-", "~", "=", "+", "o" , "O" , "X", "H", "M"]`.
- **maxRefreshRate**? -> The aimed convertions per second (mostly for videos). Defaults to `30`fps.


### **To load a new media** use the `loadMedia` function:
###### - loadMedia(sourceMedia, size?, readyCB?, errorCB?)
```js
    // Loading and converting a new image
    converter.loadMedia(
        "someImg.png",                          // The media path
        [100, 100],                             // The rendered size of the media
        ()=>console.log("Image loaded!"),       // Callback called upon media load
        ()=>console.warn("Error loading image!")// Callback called upon error loading media
    )
```
```js
    // Loading and converting a the live camera feed
    converter.loadMedia(ImageDisplay.loadCamera())
```

### **To force a convertion** use the `generate` function:
###### - generate()
```js
    // Updating the characters used for convertion
    converter.charSet = ImageToTextConverter.DEFAULT_CHARACTER_SETS.MIDDLE

    // Forcing a new convertion to use the newly updated characters
    converter.generate()
```

### **To create/transform a HTML file input that loads and converts medias automatically** use the `createHTMLFileInput` function:
###### - createHTMLFileInput(id?, onInputCB?)
```js
    // Creating an automated HTML file input
    const fileInput = converter.createHTMLFileInput()

    // Adding it to the DOM
    document.body.appendChild(fileInput)
```
```js
    // Accessing an already existing file input in the DOM
    const existingFileInput = document.getElementById("myFileInput")

    // Transforming it into an automated ImgToText file input
    converter.createHTMLFileInput(existingFileInput)
```

# [Visual Examples](#table-of-contents)

TODO

# [Npx Commands](#table-of-contents)

Here is the list of available npx commands:

## To access all `imgtotext` commands remotely / other utility commands:

### Use: `npx imgtotext <commandName> <params?>`

This is the global `imgtotext` command. It provides access to all regular `imgtotext` commands and some more. It also provides basic command autocompletion upon receiving an uncomplete command name.

#### Example use 1:
Creating a project template using the `imgtotext-template` command. (see below for more details)
`npx imgtotext template myProjectName`

#### Example use 2:
Lists all available `imgtotext` commands. (As well as aliases)
`npx imgtotext list`



****
### [Credits](#table-of-contents)

Made by Louis-Charles Biron !
