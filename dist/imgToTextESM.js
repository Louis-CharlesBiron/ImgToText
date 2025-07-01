import{ImageDisplay,Canvas,CDEUtils}from'cdejs';export class ImageToTextConverter {
    static DEFAULT_CHARACTER_SETS = {
        VERY_LOW:[..." .:"],
        DOTS:[..." .Â·':"],
        LOW:[..." .:-~=+oOXHM"],// 13 shades
        LOW_LARGE:["  "," ."," :"," -"," ~"," ="," +"," o"," O"," X"," H"," M"],
        LOW_REVERSED:[..."MHXOo+=~-:. "],
        MIDDLE:[..." .:-~=+oOXHMB8$W%@#â–‘â–’â–“â–ˆ"], // 23 shades,
        HIGH_RANGE:[..." Ë™.Â·';:,-^~=+coOXHMB8$W%@#â–‘â–’â–“â–ˆ"],// 30 shades
        HIGH_CENTRAL_SHADING:[..."MWVXvuo+;:-`. .`-:;+ouvXVMW"],
        HIGH_CENTRAL_SHADING_REVERSED:[..." .,:;~-+=oO0BDWM#@â–ˆ@#MWDB0Oo=+-~;:,. "],
        TEST_ASCII:["â–‘","â–’","â–“","â–ˆ"],
        TEST_ASCII2:[" ","â–‘","â–’","â–“","â–ˆ"],
    }
    static DEFAULT_CHARACTER_SET = ImageToTextConverter.DEFAULT_CHARACTER_SETS.LOW
    static DEFAULT_CVS_SIZE = [...ImageDisplay.RESOLUTIONS.MAX]
    static DEFAULT_MEDIA_SIZE = ["90%", "45%"]
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
     * Creates the CDE Canvas instance used for convertions
     * @param {[width, height] | Canvas | HTMLCanvasElement | OffscreenCanvas} sizeOrCanvas: Either a size array or any type of canvas 
     * @param {Number?} maxRefreshRate: The maximum framerate at which convertion will occur. (useful for dynamic convertions, such as videos) 
     * @returns A CDE Canvas instance
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

    /**
     * Loads a media and converts it. Replaces any other curret media, if any.
     * @param {ImageDisplay.SOURCE_TYPES} sourceMedia: The media to convert
     * @param {[width, height]} size: The size of the media
     * @param {Function?} readyCB: Function called when the media is loaded
     * @param {Function?} errorCB: Function called upon any error loading the media
     */
    loadMedia(sourceMedia, size=[...ImageToTextConverter.DEFAULT_MEDIA_SIZE], readyCB=null, errorCB=ImageToTextConverter.DEFAULT_MEDIA_ERROR_CALLBACK) {
        this.clear()

        this._media = new ImageDisplay(sourceMedia, [0,0], size, errorCB, (img)=>{
            if (img.isDynamic) this._CVS.start()
            else {
                this._CVS.stop()
                this.generate()
            }
            if (CDEUtils.isFunction(readyCB)) readyCB(this)
        }, null, null, true)

        this._CVS.add(this._media)
    }

    // groups the media pixels according to pxGroupingSize and returns the y and the average value of each
    #mapPixels(pxGroupingSize) {
        let CVS = this._CVS, media = this._media, width = (media.width>>0)>CVS.width?CVS.width:(media.width>>0), height = (media.height>>0)>CVS.height?CVS.height:(media.height>>0), data = CVS.ctx.getImageData(0, 0, width, height).data,
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
            const file = imgInput.files[0]
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

    /**
    TODO
        getBestResolution()

        ---GIVEN---
        - letterSpacing (0px)
        - line height (18px)
        - font-size (16px)
        - groupingSize (5px)

        - media width
        - media height

        (MAYBE) a max width/height



        return the best version of the convertion
    */

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