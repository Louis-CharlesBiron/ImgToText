[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Louis-CharlesBiron/ImgToText?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FImgToText%2Fcommits%2Fmain%2F&label=Commit%20Activity)](https://github.com/Louis-CharlesBiron/ImgToText/commits/main/)
[![GitHub last commit](https://img.shields.io/github/last-commit/Louis-CharlesBiron/ImgToText?link=https%3A%2F%2Fgithub.com%2FLouis-CharlesBiron%2FImgToText%2Fcommits%2Fmain%2F&label=Last%20Commit)](https://github.com/Louis-CharlesBiron/ImgToText/commits/main/)
[![NPM Version](https://img.shields.io/npm/v/imgtotext?label=Version&color=%237761c0)](https://www.npmjs.com/package/imgtotext)
[![NPM Downloads](https://img.shields.io/npm/d18m/imgtotext?label=NPM%20Downloads&color=%231cc959)](https://www.npmjs.com/package/imgtotext)
![GitHub Created At](https://img.shields.io/github/created-at/Louis-CharlesBiron/ImgToText?label=Since&color=violet)
![NPM License](https://img.shields.io/npm/l/imgtotext?label=License&color=5f7aa0)



# ImgToText

**ImgToText is a concise library that converts any image/video into customizable text usable!**

<span style="font-size:10px;font-family:monospace;">
                                                                     
            .oXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX= 
            OMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM-   
            XMMM~........................................OMMM~  
            XMMM-                         .~++~.         OMMM~   
            XMMM-                        :HMMMMM-        OMMM~                          MMMMMMMM                                                               MMMMMMMMMM                                        
            XMMM-                        -MMMMMM=        OMMM~                        MMMMMMMMM                                                               MMMMMMMMMM                                         
            XMMM-                         -oXXO~         OMMM~                         MMM               MMMMMMMM        MMMMMMMMMM         MMMMMMM               MMM          MMMMMMMMMMM        MMMMMMMMMM     
            XMMM-       +O:                              OMMM~                         MMMMM            MMMMMMMMMM       MMMMMMMMMMM      MMMMMMMMMM              MMM          MMMMMMMMMMM       MMMMMMMMMMM     
            XMMM-     +HMMMX=                            OMMM~                          MMMMMMMM        MMM    MMM       MMM MMM MMM      MMM    MMM              MMM          MMMM MMM MM       MMM   MMMM      
            XMMM-   =MMMMMMMMMo.            .+XMX=.      OMMM~                             MMMMMM      MMMM    MMM       MM  MM  MMM      MMMMMMMMMM              MMM          MMM  MM  MM       MMMMMMMMM       
            XMMM-.=HMMMMMMMMMMMMX-       -oHMMMMMMMX=.   OMMM~                                MMM       MMM    MMM       MM  MM  MMM      MMM                     MMM          MMM  MM  MM       MMMMMMMMM    
            XMMMoMMMMMMMMMMMMMMMMMH=..~OMMMMMMMMMMMMMMX=.OMMM~                         MMM  MMMMM       MMMMMMMMMM       MM  MM  MMM      MMMMMMMMMM              MMM          MMM  MM  MM       MMMMMM       
            XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~                         MMMMMMMMM         MMMMMMMM        MM  MM  MMM       MMMMMMMMM           MMMMMMMMMM      MMM  MM  MM       MMMMMMMMMM   
            XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~                                                                                                                                   MMM   MMMMM 
            XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~                                                                                                                                   MMMMMMMMMM
            XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~                                                                                                                                   MMMMMMMMM
            XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~
            XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~
            OMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM-
            .oHMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMHX= 
</span>


# Table of Contents

- [Getting Started](#getting-started)
- [ImageToTextConverter Class](#imagetotextconverter)
- [Visual Examples](#visual-examples)
- [Npx commands](#npx-commands)
- [Credits](#credits)

## Getting Started

1. **Get the library file. (`npm install imgtotext` or [imgToText.min.js](https://github.com/Louis-CharlesBiron/ImgToText/blob/main/dist/imgToText.min.js))** 
```HTML
    <!-- Only if you're using the browser version! Otherwise use: import {ImageToTextConverter} from "imgtotext" -->
    <script src="imgToText.min.js"></script>
```

2. **In a JS file, create a new ImageToTextConverter instance.**
```js
    // Converts the image ("someImg.png") and logs it in the console
    const converter = new ImageToTextConverter((text)=>console.log(text), "someImg.png")
```
#

# [ImageToTextConverter](#table-of-contents)

The ImageToTextConverter class allows the full convertion and customization of images/videos to text.
#### **The constructor takes the following parameters:**
###### - `new ImageToTextConverter(resultCB, sourceMedia?, maxMediaInputSize?, pxGroupingSize?, charSet?, maxRefreshRate?)`
- **resultCB** -> A callback called on each convertion, its only parameter is the text result of the latest convertion . `(text)=>{...}`
- **sourceMedia**? -> The image/video to convert. One of [`ImageDisplay.SOURCE_TYPES`](https://github.com/Louis-CharlesBiron/canvasDotEffect?tab=readme-ov-file#table-of-contents).
- **maxMediaInputSize**? -> The canvas or canvas size on which medias will be drawn. Either a size array *`[width, height]`*, a *`HTMLCanvasElement`* (to see medias before convertion), a *`OffscreenCanvas`*, or a [*imgtotext `Canvas`*](https://github.com/Louis-CharlesBiron/canvasDotEffect?tab=readme-ov-file#table-of-contents). Defaults to about `[3840, 2160]`.
- **pxGroupingSize**? -> The pixel output resolution. E.g: `1` converts pixels to characters at a 1:1 ratio (one character per media pixel), and `5` converts pixels to chars at a 25:1 ratio (one character per 5x5 pixels of the original media). Defaults to `5`.
- **charSet**? -> The characters used to draw the image using text, going from least visible to most visible. Either a `String` or an `Array`. Defaults to `[" ", ".", ":", "-", "~", "=", "+", "o" , "O" , "X", "H", "M"]`.
- **maxRefreshRate**? -> The aimed convertions per second (mostly for videos). Defaults to `30`fps.

**Note:** - Putting `null` as any parameter value will assign it the default value of this parameter, if any. (Also applicable on all functions)



### **To load a new media** use the `loadMedia` function:
###### - loadMedia(sourceMedia, size?, croppingPositions?, errorCB?, readyCB?)
```js
    // Loading and converting a new image
    converter.loadMedia(
        "someImg.png",    // The media path
        [100, 100],       // The rendered size of the media
        [[0,0], ["50%", "100%"]]     // Cropping to only use the left half of the media 
        ()=>console.log("Image loaded!"),       // Callback called upon media load
        ()=>console.warn("Error loading image!")// Callback called upon error loading media
    )
```
```js
    // Loading and converting a the live camera feed
    converter.loadMedia(ImageDisplay.loadCamera())
```

### **To format the text output of a convertion** use the *static* `formatText` function:
###### - formatText(text, outputFormatingMethod?)
```js
    // A dummy converter
    const converter = new ImageToTextConverter((text)=>{

        // Regular output (raw)
        console.log(text)

        // Adapts the output to properly render in a Markdown environment
        console.log(ImageToTextConverter.formatText(text), ImageToTextConverter.OUTPUT_FORMATS.MARKDOWN)

        // Adapts the output to properly render in a HTML environment
        console.log(ImageToTextConverter.formatText(text), ImageToTextConverter.OUTPUT_FORMATS.HTML)
    })
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

Coming soon (TODO)
- img example
- text example
- camera/video example (gif)

# Converting some text
```
   MMMMMMMM     MMMMMMMM        MMMMMMMMM      MMMMMMMM       MMMMMMMM      
 MMMMMMMMMM     MMMMMMMMMM      MMMMMMMMM      MMMMMMMM      MMMMMMMMM      
 MMMM           MMM   MMMM      MMM                 MMM      MMM            
MMMM            MMM    MMMM     MMM                 MMM      MMMMMM         
MMMM            MMM     MMM     MMMMMMMM            MMM       MMMMMMMM      
MMMM            MMM    MMMM     MMM                 MMM          MMMMMM     
 MMM            MMM    MMMM     MMM                 MMM             MMM     
 MMMMM   MM     MMM MMMMMM      MMM            MM  MMMM      MM    MMMM     
  MMMMMMMMM     MMMMMMMMM       MMMMMMMMM      MMMMMMM       MMMMMMMMMM     
    MMMMMM                                      MMMM          MMMMMM
```

### Settings used (All defaults):

- Text scale-x: 2
- Text scale-y: 1.25
- Pixel Grouping Size: 5x5
- Character set: [ " ", ".", ":", "-", "~", "=", "+", "o", "O", "X", "H", "M" ]


### JS code:
```js
new ImageToTextConverter((text)=>{console.log(text)}, "CDEJS")
``` 

# Converting an image:

![Icon of Geometry Dash](https://static.wikia.nocookie.net/logopedia/images/4/41/Geometry_Dash_Icon.svg/revision/latest?cb=20220220121501)

```
++++ooooooooooo++ooooooooooooooooooooooooooooo~::~+ooooooooooooooooooooooooooooooo++
++ooooOoooOooooooO~-::::::::::::::::::::::::.  ~=: .:::::::::::::::::--=++OXOOOOOoo+
++ooo    .:. +oooO~:.....................   :=oooo+-.  ...................-~+OXOOOoo
++ooo    .- .+ooo+~....................   ~+ooooooooo=:   ..................:~+OOoo+
++ooo    -   =oo+~:..................  :=ooooooooooooooo-.  ..................:~Oo++
+++oo+~~=o+~~++=-:................   ~+ooooooooooooooooooo=:  .......::::......-=o++
++++++oooo++=~-:::::::::::::::..  :=ooooooooo=--+oooooooooooo-.  .::.::::::::::-~O++
+oo+===~---::::::::::::::::::   ~+ooooooooo~..~~.:=oooooooooooo=:  .:::::::::::-~O++
+o+~::::::::::::::::::::::.  :=ooooooooo+- -+OOOO+- -+oooooooooooo-. .:::::::::-=O++
+o+~:::::::::::--:::::::.  ~+ooooooooooo=:.-oOOOOo-.-=oooo+:~ooooooo=:  .::::::-=O++
+o+~:::::::::::---:::.  :=ooooooooooooooooo-.:==:.~oooo+~.:~: -+ooooooo-. .::::-=O++
oo+~--------------:.  ~+ooooooooo~: :=ooooooo=:-=oooo+: -=+oo+~.:~ooooooo=:  :-~=Ooo
ooo~------------:  :+ooooooooo+-.-+o+-.-+oooooooooo~.:=oooooo+=- -+ooooooooo-. :~Ooo
ooo=----------.  ~oooooooooo+: ~oOOOOoo~ :oooooo+: -+ooooooo~..~oooooooooooooo=: :=o
+o+~:---------  -+oooooooooooo~.:=ooo=:.~ooooo~.:=ooooooo=- -+ooooooooooooooo++~. :~
+o+~::::::::---:. .~oooooooooooo=:.:.-=oooo+- -+ooooooo~..~oooooooo+++++++++=:  .==+
+o+~:::::::::::---.  -=++++oooooooo~ooooo~.:=ooooooo=- -+++++++++++++++++=-.  .:~O++
+o+~::::::::::----:::  .-+++++++++++++=: -=ooooooo~..~+++++++++++++++++=:  ..::-~O++
+o+~:::::::-~~----:::::.  -=+++++++++. -++ooooo=- -+++++++++++++++++=-.  .:::::-~O++
+o+~-------=MMo~---------:  .-++++++++~.:=+++~..~+++++++++++++++++=:  .:--------~O++
+o+~-----~oM~.HX=-----------.  :=+++++++=: : -+++++++++++++++++=-.  .-----------~O++
+o+~-----OH:   OH=------------:. .-++++++++~+++++++++++++++++=:  .::-~~~~-------~O++
+o+~---~XX.     +M+--------------.  :=++++++++++++++++++++=-.  .:----~~~~------~~O++
+o+~--=Ho        -Mo---------------:. .-++++++++++++++++=:  .:-------~~~--------~O++
+o+~-+M=          :HX~----------------.  :~++++++++++=-.  :----------~~~~------~~O++
+o+~OM-............:OH=-----------------:. .-++++++=:  .:------------~~~~------~~O++
+++=H-:::::::::::::::oM+~------------------.  :~=-.  :---------------~~~~------~~O++
+++~-::::::::::---::::=Mo~-------------------:.   .:-----------------~~~~------~=O++
++O~+oooooooooOOOOOOOOOXMO======================~~~=====================~~~~~~~~o+++
+++o~~~~~~~~~~~===~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~===~~~~~~~oo+++
++++o+~~~~~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~===~~~~~+oooo++
++++++o++=~~~~~==~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===~~~~~~~~~~~===~=+oooooo+++
++++++++++oo+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++oo+++++++++++
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
```

### Settings used:

- Media width:  100%
- Media height: 40%
- Pixel Grouping Size: 3x3
- Character set (Default): [ " ", ".", ":", "-", "~", "=", "+", "o", "O", "X", "H", "M" ]


### JS code:
```js
        new ImageToTextConverter(
            (text)=>{console.log(text)},
            "https://static.wikia.nocookie.net/logopedia/images/4/41/Geometry_Dash_Icon.svg",
            null,
            3
        )
``` 

# Converting a video:

TODO

### Settings used:

- Media width: 
- Media height: 
- Pixel Grouping Size: 
- Character set (Default): 


### JS code:
```js

``` 

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

### To create a template page

#### `npx imgtotext-template <projectName?>` | *`npx imgtotext-t <projectName?>`*

This command creates a **modular** ImgToText template page. It accepts an optional project name as parameter.

### To create a browser template page

#### `npx imgtotext-browser-template <projectName?>` | *`npx imgtotext-bt <projectName?>`*

This command creates a **non modular** ImgToText template page. It accepts an optional project name as parameter.

****
### [Credits](#table-of-contents)

Made by Louis-Charles Biron !