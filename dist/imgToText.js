'use strict';
class ImageToTextConverter {
    static DEFAULT_CHARACTER_SETS = {
        VERY_LOW:[" ",".",":"],
        DOTS:[" ",".","·","'",":"],
        SIMPLE:[" ",".",":","-","~","=","Ξ","#"],
        LOW:[" ",".",":","-","~","=","+","o","O","X","H","M"],
        LOW_LARGE:["  "," ."," :"," -"," ~"," ="," +"," o"," O"," X"," H"," M"],
        LOW_REVERSED:["M","H","X","O","o","+","=","~","-",":","."," "],
        MIDDLE:[" ",".",":","-","~","=","+","o","O","X","H","M","B","8","$","W","%","@","#","░","▒","▓","█"],
        HIGH_RANGE:[" ",".",",","-","~","=",":",";","+","c","o","O","X","H","M","B","$","Ξ","#","@","░","▒","▓","█"],
        HIGH_CENTRAL_SHADING:["M","W","V","X","v","u","o","+",";",":","-","`","."," ",".","`","-",":",";","+","o","u","v","X","V","W","M"],
        HIGH_CENTRAL_SHADING_REVERSED:[" ",".",",",":",";","~","-","+","=","o","O","0","B","D","W","M","Ξ","#","@","█","@","#","Ξ","M","W","D","B","0","O","o","=","+","-","~",";",":",",","."," "],
        BRIGHT_ASCII:["░","▒","▓","█"],
        ASCII:[" ","░","▒","▓","█"],
    }
    static DEFAULT_CHARACTER_SET = ImageToTextConverter.DEFAULT_CHARACTER_SETS.LOW
    static DEFAULT_CVS_SIZE = [...ImageDisplay.RESOLUTIONS.MAX]
    static DEFAULT_MEDIA_SIZE = ["92%", "45%"]
    static DEFAULT_TEXT_SCALE = [1.92, 1.45]
    static DEFAULT_MEDIA_ERROR_CALLBACK = (errorCode, media)=>console.warn("Error while loading media:", ImageDisplay.getErrorFromCode(errorCode), "("+media+")")

    #cachedRange = null
    /**
     * @param {Function} resultCB: A callback called upon a convertion. (text)=>{} 
     * @param {*} sourceMedia: The media to convert
     * @param {[width, height] | Canvas | HTMLCanvasElement | OffscreenCanvas} maxMediaInputSize: Either a size array or any type of canvas 
     * @param {Number} pxGroupingSize: The pixel output resolution. Examples, put 1 to get one character per media pixel, or put 5 to get one character per 5x5 pixels of the original media 
     * @param {String[] | String} charSet: The characters used to draw the image going from least visible to most visible.
     * @param {Number} maxRefreshRate: The maximal convertions per second 
     */
    constructor(resultCB, sourceMedia, maxMediaInputSize=ImageToTextConverter.DEFAULT_CVS_SIZE, pxGroupingSize=5, charSet, maxRefreshRate=30) {
        this._CVS = this.#createCVS(maxMediaInputSize, maxRefreshRate)
        this._resultCB = resultCB
        this._pxGroupingSize = pxGroupingSize||5
        this._charSet = charSet??ImageToTextConverter.DEFAULT_CHARACTER_SET
        this.#updateCachedRange()
        this._media = null
        if (sourceMedia) this.loadMedia(sourceMedia)
    }

    /**
     * Creates the CDEJS Canvas instance used for convertions
     * @param {[width, height] | Canvas | HTMLCanvasElement | OffscreenCanvas} sizeOrCanvas: Either a size array or any type of canvas 
     * @param {Number?} maxRefreshRate: The maximum framerate at which convertion will occur. (useful for dynamic convertions, such as videos) 
     * @returns A CDEJS Canvas instance
     */
    #createCVS(sizeOrCanvas, maxRefreshRate) {
        let canvas = null
        if (Array.isArray(sizeOrCanvas)) canvas = new OffscreenCanvas(sizeOrCanvas[0], sizeOrCanvas[1])
        else if (sizeOrCanvas instanceof Canvas) canvas = sizeOrCanvas.cvs
        else if (sizeOrCanvas instanceof HTMLCanvasElement || sizeOrCanvas instanceof OffscreenCanvas) canvas = sizeOrCanvas
        else canvas = new OffscreenCanvas(...ImageToTextConverter.DEFAULT_CVS_SIZE)

        const CVS = new Canvas(canvas, ()=>{
            if (this._media?.initialized) this._resultCB(this.#getText(this.#mapPixels(this._pxGroupingSize)))
        }, maxRefreshRate, null, null, null, true)

        return CVS
    }

    // updates cached characters set range
    #updateCachedRange() {
        let range = [0], c_ll = this._charSet.length, rangeDivision = 255/c_ll
        for (let i=1;i<c_ll;i++) range[i] = range[i-1]+rangeDivision
        this.#cachedRange = range
    }

    // groups the media pixels according to pxGroupingSize and returns the y and the average value of each
    #mapPixels(pxGroupingSize=this._pxGroupingSize) {
        let CVS = this._CVS, media = this._media, mediaSize = media.trueSize, width = (mediaSize[0]>>0)>CVS.width?CVS.width:(mediaSize[0]>>0), height = (mediaSize[0]>>0)>CVS.height?CVS.height:(mediaSize[1]>>0), data = CVS.ctx.getImageData(0, 0, width, height).data,
            x, y, atY, atX, atI, pxGroupingCount = (pxGroupingSize**2)*4, bigPxCountX = width/pxGroupingSize, bigPxCountY = height/pxGroupingSize, bigPixels = [], minDif = CDEUtils.getAcceptableDiff

        for (y=0;y<height;y+=pxGroupingSize) {
            atY = y*pxGroupingSize
            for (x=0;x<width;x+=pxGroupingSize) {
                atX = x*pxGroupingSize
                const overflow = width-(x+pxGroupingSize), bigPx = [], offsetX = minDif((((atX/pxGroupingSize)/width)*bigPxCountX)*pxGroupingSize*4, 0.000001), offsetY = minDif((((atY/pxGroupingSize)/height)*bigPxCountY)*pxGroupingCount*bigPxCountX, 0.000001)
                
                for (let i=0,adjust=0;i<pxGroupingCount;i+=4) {
                    if (!((i/4)%pxGroupingSize)&&i) adjust = (width*4)*((i/pxGroupingCount)*pxGroupingSize)-i
                    atI = offsetX+offsetY+i+adjust

                    const r = data[atI], g = data[atI+1], b = data[atI+2]
                    bigPx.push((!data[atI+3] || r==null || g==null || b==null || (i/4)%(pxGroupingSize) >= pxGroupingSize+overflow) ? null : (r+g+b)/3)
                }

                let b_ll = bigPx.length, total=0, nullCount=0
                for (let i=0;i<b_ll;i++) {
                    const pxAvg = bigPx[i]
                    if (pxAvg==null) nullCount++
                    else total+=pxAvg
                }
                bigPixels.push([y, total/(b_ll-nullCount)||0])
            }
        }

        return bigPixels
    }

    // converts the results of mapPixels() to characters based on the current charSet
    #getText(pixelMappingResults) {
        let range = this.#cachedRange, chars = this._charSet, c_ll = chars.length, p_ll = pixelMappingResults.length, textResults = "", lastY = 0

        for (let i=0;i<p_ll;i++) {
            let bigPx = pixelMappingResults[i], y = bigPx[0], avg = bigPx[1], atValue = -1, charIndex = 0

            for (let i=0;i<c_ll;i++) {
                const newValue = range[i]
                if (newValue<=avg && newValue>atValue) {
                    atValue = newValue
                    charIndex = i
                }
            }

            if (y != lastY) textResults+="\n"
            textResults += chars[charIndex]
            lastY = y
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
     * @param {[scaleX, scaleY]?} scale: The X and Y scale of the base text (pre-convertion)
     * @param {Color?} color: The color of the base text (pre-convertion), can be used to add shading to the text
     * @param {Boolean?} isFilled: Whether the text is filled or is an outline
     * @param {Number?} letterSpacing: The letter spacing in pixel of the base text (pre-convertion)
     * @param {Number?} wordSpacing: The word spacing in pixel of the base text (pre-convertion)
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

    // Forces a convertion
    generate() {
        this._CVS.drawSingleFrame()
    }

    // Clears anything drawn on the converter's canvas
    clear() {
        this._CVS.removeAllObjects()
        this._CVS.clear()
    }

    get CVS() {return this._CVS}
    get cvs() {return this._CVS.cvs}
    get size() {return this._CVS.size}
    get charSet() {return this._charSet}
    get media() {return this._media}
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
        this.#updateCachedRange()
    }
    set pxGroupingSize(pxGroupingSize) {this._pxGroupingSize = pxGroupingSize}
    set maxRefreshRate(maxRefreshRate) {this._CVS.fpsLimit = maxRefreshRate} 
    set resultCB(resultCB) {this._resultCB = resultCB} 
}