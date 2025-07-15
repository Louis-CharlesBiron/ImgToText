
class ImageToTextConverter {
    static DEFAULT_CHARACTER_SETS = {
        VERY_LOW:[" ",".",":"],
        VERY_LOW_REVERSED:[":","."," "],
        LOW:[" ",".",":","-","~","=","+","o","O","X","H","M"],
        LOW_LARGE:["  "," ."," :"," -"," ~"," ="," +"," o"," O"," X"," H"," M"],
        LOW_REVERSED:["M","H","X","O","o","+","=","~","-",":","."," "],
        MIDDLE:[" ",".",":","-","~","=","+","o","O","X","H","M","B","8","$","W","%","@","#"],
        MIDDLE_REVERSED:["#","@","%","W","$","8","B","M","H","X","O","o","+","=","~","-",":","."," "],
        MIDDLE_PATCHY:[" ",".",":","-","~","=","+","o","O","X","H","M","B","8","$","W","%","@","#","░","▒","▓","█"],
        MIDDLE_PATCHY_REVERSED:["█","▓","▒","░","#","@","%","W","$","8","B","M","H","X","O","o","+","=","~","-",":","."," "],
        HIGH:[" ",".",",","-","~","=",":",";","+","c","o","O","X","H","M","B","$","Ξ","#","@","░","▒","▓","█"],
        HIGH_REVERSED:["█","▓","▒","░","@","#","Ξ","$","B","M","H","X","O","o","c","+",";",":","=","~","-",",","."," "],
        HIGH_CENTRAL_SHADING:[,"▓","▒","░","@","#","Ξ","$","B","M","H","X","O","o","c","+",";",":","=","~","-",",","."," ",".",",","-","~","=",":",";","+","c","o","O","X","H","M","B","$","Ξ","#","@","░","▒","▓","█"],
        HIGH_OUTER_SHADING:[" ",".",",","-","~","=",":",";","+","c","o","O","X","H","M","B","$","Ξ","#","@","░","▒","▓","█","▓","▒","░","@","#","Ξ","$","B","M","H","X","O","o","c","+",";",":","=","~","-",",","."," "],
        ASCII:[" ","░","▒","▓","█"],
        ASCII_REVERSED:["█","▓","▒","░"," "],
        BRIGHT_ASCII:["░","▒","▓","█"],
        BRIGHT_ASCII_REVERSED:["█","▓","▒","░"],
        LINES:[" ","─","━","═","│","║","┃","┼","╬","╋","█"],
        LINES_REVERSED:["█","╋","╬","┼","┃","║","│","═","━","─"," "],
        LINE_SEMI_CENTRAL_SHADING:[" ","─","━","│","┃","┼","╋","═","║","╬","█"],
        BINARY:[" ","1","0"],
        BINARY_REVERSED:["0","1"," "],
        BINARY_EXPANDED:[" ",".","¹","⁰","1","0"],
        BINARY_EXPANDED_REVERSED:["0","1","⁰","¹","."," "],
        DOTS:[" ",".","·","'",":"],
        SIMPLE:[" ",".",":","-","~","=","Ξ","#"],
        SYMBOLS:[" ",".","*","+","∞","%","#","&","§","Ξ","@","█"],
        WAVY_BOXES:[" ",".",":","=","≡","≣","▭","▮","█"],
    }
    static DEFAULT_CHARACTER_SET = ImageToTextConverter.DEFAULT_CHARACTER_SETS.LOW
    static DEFAULT_CVS_SIZE = [...ImageDisplay.RESOLUTIONS.MAX]
    static DEFAULT_MEDIA_SIZE = ["92%", "45%"]
    static DEFAULT_TEXT_SCALE = [2, 1.25]
    static DEFAULT_MEDIA_ERROR_CALLBACK = (errorCode, media)=>console.warn("Error while loading media:", ImageDisplay.getErrorFromCode(errorCode), "("+media+")")
    static OUTPUT_FORMATS = {NONE:0, MARKDOWN_COLORLESS:1, HTML:2, UNICODE_MONOSPACE:3, NON_BREAKING_SPACES:4}
    static DEFAULT_OUTPUT_FORMAT = ImageToTextConverter.OUTPUT_FORMATS.NONE
    static DEFAULT_COLOR_OPTIMISATION_LEVEL = 12
    static UNICODE_MONOSPACE_CONVERTIONS = {"a":"𝚊","b":"𝚋","c":"𝚌","d":"𝚍","e":"𝚎","f":"𝚏","g":"𝚐","h":"𝚑","i":"𝚒","j":"𝚓","k":"𝚔","l":"𝚕","m":"𝚖","n":"𝚗","o":"𝚘","p":"𝚙","q":"𝚚","r":"𝚛","s":"𝚜","t":"𝚝","u":"𝚞","v":"𝚟","w":"𝚠","x":"𝚡","y":"𝚢","z":"𝚣","A":"𝙰","B":"𝙱","C":"𝙲","D":"𝙳","E":"𝙴","F":"𝙵","G":"𝙶","H":"𝙷","I":"𝙸","J":"𝙹","K":"𝙺","L":"𝙻","M":"𝙼","N":"𝙽","O":"𝙾","P":"𝙿","Q":"𝚀","R":"𝚁","S":"𝚂","T":"𝚃","U":"𝚄","V":"𝚅","W":"𝚆","X":"𝚇","Y":"𝚈","Z":"𝚉","0":"𝟶","1":"𝟷","2":"𝟸","3":"𝟹","4":"𝟺","5":"𝟻","6":"𝟼","7":"𝟽","8":"𝟾","9":"𝟿",}

    #cachedRangeDivision = null
    /**
     * @param {Function} resultCB: A callback called upon a conversion. (text)=>{} 
     * @param {*} sourceMedia: The media to convert
     * @param {Boolean} useColors: Whether to color the generated text or keep it in a uniform color. (Can be VERY performance heavy)
     * @param {Number} pxGroupingSize: The pixel output resolution. Examples, put 1 to get one character per media pixel, or put 5 to get one character per 5x5 pixels of the original media 
     * @param {String[] | String} charSet: The characters used to draw the image going from least visible to most visible.
     * @param {[width, height] | Canvas | HTMLCanvasElement | OffscreenCanvas} maxMediaInputSize: Either a size array or any type of canvas 
     * @param {Number} maxRefreshRate: The maximal conversions per second 
     */
    constructor(resultCB, sourceMedia, pxGroupingSize=5, charSet, useColors=false, maxMediaInputSize=ImageToTextConverter.DEFAULT_CVS_SIZE, maxRefreshRate=30) {
        this._CVS = this.#createCVS(maxMediaInputSize, maxRefreshRate)
        this._resultCB = resultCB
        this._pxGroupingSize = pxGroupingSize||5
        this._charSet = charSet??ImageToTextConverter.DEFAULT_CHARACTER_SET
        this._useColors = useColors||false
        this._colorOptimizationLevel = ImageToTextConverter.DEFAULT_COLOR_OPTIMISATION_LEVEL
        this.#updateCachedRangeDivision()
        this._media = null
        if (typeof sourceMedia=="string" && !sourceMedia.match(/\..{1,4}$/gi)) this.createBigText(sourceMedia)
        else if (sourceMedia) this.loadMedia(sourceMedia)
    }

    /**
     * Creates the CDEJS Canvas instance used for conversions
     * @param {[width, height] | Canvas | HTMLCanvasElement | OffscreenCanvas} sizeOrCanvas: Either a size array or any type of canvas 
     * @param {Number?} maxRefreshRate: The maximum framerate at which conversion will occur. (useful for dynamic conversions, such as videos) 
     * @returns A CDEJS Canvas instance
     */
    #createCVS(sizeOrCanvas, maxRefreshRate) {
        let canvas = null
        if (Array.isArray(sizeOrCanvas)) canvas = new OffscreenCanvas(sizeOrCanvas[0], sizeOrCanvas[1])
        else if (sizeOrCanvas instanceof Canvas) canvas = sizeOrCanvas.cvs
        else if (sizeOrCanvas instanceof HTMLCanvasElement || sizeOrCanvas instanceof OffscreenCanvas) canvas = sizeOrCanvas
        else canvas = new OffscreenCanvas(...ImageToTextConverter.DEFAULT_CVS_SIZE)

        const CVS = new Canvas(canvas, ()=>{
            if (this._media?.initialized) this._resultCB(this.#getText(this.#mapPixels()))
        }, maxRefreshRate, null, null, null, true)

        return CVS
    }

    // updates cached characters set range
    #updateCachedRangeDivision() {
        this.#cachedRangeDivision =  1/(255/this._charSet.length)
    }

    // groups the media pixels according to pxGroupingSize and returns the y and the average value of each
    #mapPixels(pxGroupingSize=this._pxGroupingSize) {
        let CVS = this._CVS, useColors = this._useColors, media = this._media, mediaSize = media.trueSize, width = mediaSize[0]>CVS.width?CVS.width:(mediaSize[0]>>0), height = mediaSize[0]>CVS.height?CVS.height:(mediaSize[1]>>0), data,
            x, y, atY, atX, atI, pxGroupingCount = (pxGroupingSize**2)*4, bigPxCountX = width/pxGroupingSize, bigPxCountY = height/pxGroupingSize, bigPixels = [], minDif = CDEUtils.getAcceptableDiff

        try {data = CVS.ctx.getImageData(0, 0, width, height).data} catch(e) {
            const src = this._media.source.src
            console.warn("Media unavailable due to cross-origin, width/height or loading issues."+(src?" \n("+src+")":"")+"\n\n'"+e.message.split(":")[1].trim()+"'")
            data = []
        }

        for (y=0;y<height;y+=pxGroupingSize) {
            atY = y*pxGroupingSize
            for (x=0;x<width;x+=pxGroupingSize) {
                atX = x*pxGroupingSize
                const overflow = width-(x+pxGroupingSize), bigPx = [], offsetX = minDif((((atX/pxGroupingSize)/width)*bigPxCountX)*pxGroupingSize*4, 0.000001), offsetY = minDif((((atY/pxGroupingSize)/height)*bigPxCountY)*pxGroupingCount*bigPxCountX, 0.000001)
                
                for (let i=0,adjust=0;i<pxGroupingCount;i+=4) {
                    if (!((i/4)%pxGroupingSize)&&i) adjust = (width*4)*((i/pxGroupingCount)*pxGroupingSize)-i
                    atI = offsetX+offsetY+i+adjust

                    const r = data[atI], g = data[atI+1], b = data[atI+2]
                    bigPx.push((!data[atI+3] || r==null || g==null || b==null || (i/4)%(pxGroupingSize) >= pxGroupingSize+overflow) ? null : useColors?[r,g,b]:(r+g+b)/3)
                }

                let b_ll = bigPx.length, total=0, nullCount=0, totalR=0, totalG=0, totalB=0
                for (let i=0;i<b_ll;i++) {
                    let pxAvg = bigPx[i]
                    if (pxAvg==null) nullCount++
                    else if (useColors) {
                        const r = pxAvg[0] , g = pxAvg[1], b = pxAvg[2]
                        pxAvg = (r+g+b)/3
                        totalR+=r
                        totalB+=b
                        totalG+=g
                    }
                    total+=pxAvg
                }

                const adjustedCount = (b_ll-nullCount)||0
                bigPixels.push(useColors ? [y, total/adjustedCount, (totalR/adjustedCount)>>0, (totalG/adjustedCount)>>0, (totalB/adjustedCount)>>0] : [y, total/adjustedCount])
            }
        }

        return bigPixels
    }

    // converts the results of mapPixels() to characters based on the current charSet
    #getText(pixelMappingResults) {
        let rangeDivision = this.#cachedRangeDivision, useColors = this._useColors, tolerance = this._colorOptimizationLevel, isColorOptimized = useColors&&tolerance, chars = this._charSet, p_ll = pixelMappingResults.length, textResults = "", lastY = 0, streaks, s_ll = 0

        for (let i=0;i<p_ll;i++) {
            const bigPx = pixelMappingResults[i], y = bigPx[0], char = chars[Math.min(((bigPx[1]||0)*rangeDivision)|0, chars.length-1)], r = bigPx[2], g = bigPx[3], b = bigPx[4]

            if (isColorOptimized) {
                if (!i) streaks = [[char, r, g, b]]
                else {
                    const streak = streaks[s_ll], sr = streak[1], sg = streak[2], sb = streak[3]
                    if (y != lastY) streak[0] += "<br>"
                    if (r<=(sr+tolerance) && r>=(sr-tolerance) && g<=(sg+tolerance) && g>=(sg-tolerance) && b<=(sb+tolerance) && b>=(sb-tolerance)) streak[0] += char
                    else s_ll = streaks.push([char, r, g, b])-1
                }
            } else {
                if (y != lastY) textResults += useColors ? "<br>" : "\n"
                textResults += useColors ? ((r+g+b) ? `<c style="color:rgb(${r},${g},${b});">${char}</c>` : `<c>${char}</c>`) : char
            }
            lastY = y
        }

        if (isColorOptimized) {
            s_ll++
            for (let i=0;i<s_ll;i++) {
                const streak = streaks[i], sr = streak[1], sg = streak[2], sb = streak[3]
                textResults += (sr+sg+sb) ? `<c style="color:rgb(${sr},${sg},${sb})">${streak[0]}</c>` : `<c>${streak[0]}</c>`
            }
        }
        
        return textResults
    }

    /**
     * Loads a media and converts it. Replaces any other current media, if any.
     * @param {ImageDisplay.SOURCE_TYPES} sourceMedia: The media to convert
     * @param {[width, height]} size: The size of the media
     * @param {[ [startX, startY], [endX, endY] ]} croppingPositions: The source cropping positions. Delimits a rectangle which indicates the source drawing area to draw from
     * @param {Function?} errorCB: Function called upon any error loading the media
     * @param {Function?} readyCB: Function called when the media is loaded
     */
    loadMedia(sourceMedia, size=[...ImageToTextConverter.DEFAULT_MEDIA_SIZE], croppingPositions=null, errorCB=ImageToTextConverter.DEFAULT_MEDIA_ERROR_CALLBACK, readyCB=null) {
        this.clear()

        this._media = new ImageDisplay(sourceMedia, [0,0], size, errorCB, (img)=>{
            if (img.isDynamic) this._CVS.start()
            else {
                this._CVS.stop()
                this.generate()
            }
            if (CDEUtils.isFunction(readyCB)) readyCB(this)
        }, null, null, true)

        this._media.sourceCroppingPositions = croppingPositions

        this._CVS.add(this._media)
    }

    /**
     * Loads custom text and converts it to big text. Replaces any other current media, if any.
     * @param {String} text: The text to convert to big text
     * @param {String?} font: The font, size and styles to use 
     * @param {[scaleX, scaleY]?} scale: The X and Y scale of the base text (pre-conversion)
     * @param {Color?} color: The color of the base text (pre-conversion), can be used to add shading to the text
     * @param {Boolean?} isFilled: Whether the text is filled or is an outline
     * @param {Number?} letterSpacing: The letter spacing in pixel of the base text (pre-conversion)
     * @param {Number?} wordSpacing: The word spacing in pixel of the base text (pre-conversion)
     * @param {TextStyles.CAPS_VARIANTS?} fontVariantCaps: Specifies alternative capitalization
     * @param {TextStyles.DIRECTIONS?} direction: The text direction
     * @param {TextStyles.STRETCHES?} fontStretch: The text streching 
     * @param {TextStyles.RENDERINGS?} textRendering: The text rendering method
     */
    createBigText(text, font=null, scale=[...ImageToTextConverter.DEFAULT_TEXT_SCALE], color=null, isFilled=true, letterSpacing=8, wordSpacing=-20, fontVariantCaps=null, direction=null, fontStretch=null, textRendering=TextStyles.RENDERINGS.LEGIBLE) {
        font??="normal 54px monospace"
        scale??=[...ImageToTextConverter.DEFAULT_TEXT_SCALE]

        this._CVS.stop()
        this.clear()
        this._media = new TextDisplay(text, [0,0], color, (render)=>render.textProfile1.update(font, letterSpacing, wordSpacing, fontVariantCaps, direction, fontStretch, null, TextStyles.ALIGNMENTS.START, TextStyles.BASELINES.TOP, textRendering), isFilled?Render.DRAW_METHODS.FILL:Render.DRAW_METHODS.STROKE, null, null, null, null, true)
        this._CVS.add(this._media)
        this._media.scale = scale
        this.generate()
    }

    /**
     * Creates a HTML file input according to this program's restrictions and automatically loads received medias
     * @param {Number? | HTMLInputElement?} id: Either the id of the newly created input or an existing input to append the features to 
     * @param {Function?} onInputCB: Custom callback called on input
     * @returns the created HTML input
     */
    createHTMLFileInput(id=null, onInputCB=null) {
        const usesOldInput = id instanceof HTMLInputElement, input = usesOldInput ? id : document.createElement("input")
        input.type = "file"
        if (id && !usesOldInput) input.id = id
        input.accept = ImageDisplay.getSupportedHTMLAcceptValue()
        input.oninput=()=>{
            const file = input.files[0]
            if (CDEUtils.isFunction(onInputCB)) onInputCB(file, this)
            if (file) {
                if (ImageDisplay.isVideoFormatSupported(file)) this.loadMedia(ImageDisplay.loadVideo(file))
                else if (ImageDisplay.isImageFormatSupported(file)) {
                    const fileReader = new FileReader()
                    fileReader.onload=e=>this.loadMedia(ImageDisplay.loadImage(e.target.result, null, true))
                    fileReader.readAsDataURL(file)
                }
            }
        }
        return input
    }

    /**
     * Formats the provided text to make it render more properly on certain environments
     * @param {String} text: The text generated by a conversion
     * @param {ImageToTextConverter.OUTPUT_FORMATS?} outputFormatingMethod: The formating method assigned to the desired environment
     * @returns The formated text
     */
    static formatText(text, outputFormatingMethod=ImageToTextConverter.DEFAULT_OUTPUT_FORMAT) {
        const outputFormats = ImageToTextConverter.OUTPUT_FORMATS
        if (outputFormatingMethod==outputFormats.MARKDOWN_COLORLESS) return "```\n"+text+"\n```"
        else if (outputFormatingMethod==outputFormats.HTML) return `<div style="white-space: pre !important;font-family: monospace !important;font-size: 16px;letter-spacing: 0px;line-height: 18px;">${text}</div>`
        else if (outputFormatingMethod==outputFormats.NON_BREAKING_SPACES) return text.replaceAll(" ", "\u00A0")
        else if (outputFormatingMethod==outputFormats.UNICODE_MONOSPACE) {
            const unicodeMonospaceConversions = ImageToTextConverter.UNICODE_MONOSPACE_CONVERTIONS
            return text.replaceAll(/./g, (char)=>unicodeMonospaceConversions[char]||char)
        }
        return text
    }

    // Forces a conversion
    generate() {
        this._CVS.drawSingleFrame()
    }

    // Clears anything drawn on the converter's canvas
    clear() {
        if (this._media) this._media.remove()
        this._CVS.clear()
    }

    /**
     * Updates the pxGroupingSize and forces a conversion with the new value
     * @param {Number} pxGroupingSize: The pixel output resolution. Examples, put 1 to get one character per media pixel, or put 5 to get one character per 5x5 pixels of the original media 
     * @returns The updated pxGroupingSize
     */
    updatePxGroupingSize(pxGroupingSize=5) {
        this._pxGroupingSize = pxGroupingSize
        this.generate()
        return this._pxGroupingSize
    }

    /**
     * Updates the charSet and forces a conversion with the new value
     * @param {String[] | String} charSet: The characters used to draw the image going from least visible to most visible. (Leave blank for a random set among default ones)
     * @returns The updated charSet
     */
    updateCharSet(charSet=ImageToTextConverter.DEFAULT_CHARACTER_SETS[CDEUtils.random(0,ImageToTextConverter.DEFAULT_CHARACTER_SETS.length)]) {
        this.charSet = charSet
        this.generate()
        return this.charSet
    }

    /**
     * Updates whether the generated text uses colors and forces a conversion with the new value
     * @param {Boolean} useColors: Whether to color the generated text or keep it in a uniform color 
     * @returns The updated useColors value
     */
    updateUseColors(useColors=false) {
        this._useColors = useColors
        this.generate()
        return this._useColors
    }

    /**
     * Updates the colorOptimizationLevel and forces a conversion with the new value
     * @param {Number? | null} colorOptimizationLevel: Defines the color tolerance for character grouping optimizations. If false or null, disables the character grouping optimizations.
     * @returns The updated useColors value
     */
    updateColorOptimizationLevel(colorOptimizationLevel=ImageToTextConverter.DEFAULT_COLOR_OPTIMISATION_LEVEL) {
        this._colorOptimizationLevel = colorOptimizationLevel
        this.generate()
        return this._colorOptimizationLevel
    }

    get CVS() {return this._CVS}
    get cvs() {return this._CVS.cvs}
    get size() {return this._CVS.size}
    get charSet() {return this._charSet}
    get media() {return this._media}
    get useColors() {return this._useColors}
    get colorOptimizationLevel() {return this._colorOptimizationLevel}
    get pxGroupingSize() {return this._pxGroupingSize}
    get resultCB() {return this._resultCB}
    get maxRefreshRate() {return this._CVS.fpsLimit}

    set size(size) {
        this._CVS.width = size[0]
        this._CVS.height = size[1]
    }
    set charSet(charSet) {
        if (typeof charSet=="string") this._charSet = [...charSet]
        else this._charSet = charSet
        this.#updateCachedRangeDivision()
    }
    set colorOptimizationLevel(level) {this._colorOptimizationLevel = level}
    set useColors(useColors) {this._useColors = useColors}
    set pxGroupingSize(pxGroupingSize) {this._pxGroupingSize = pxGroupingSize}
    set maxRefreshRate(maxRefreshRate) {this._CVS.fpsLimit = maxRefreshRate} 
    set resultCB(resultCB) {this._resultCB = resultCB} 
}