
class ImgToTextConverter {
    static DEFAULT_CHARACTER_SETS = {
        VERY_LOW:[..." .:"],
        DOTS:[..." .·':"],
        LOW:[..." .:-~=+oOXHM"],// 13 shades
        LOW_LARGE:["  "," ."," :"," -"," ~"," ="," +"," o"," O"," X"," H"," M"],
        LOW_REVERSED:[..."MHXOo+=~-:. "],
        MIDDLE:[..." .:-~=+oOXHMB8$W%@#░▒▓█"], // 23 shades,
        HIGH_RANGE:[..." ˙.·';:,-^~=+coOXHMB8$W%@#░▒▓█"],// 30 shades
        HIGH_CENTRAL_SHADING:[..."MWVXvuo+;:-`. .`-:;+ouvXVMW"],
        HIGH_CENTRAL_SHADING_REVERSED:[..." .,:;~-+=oO0BDWM#@█@#MWDB0Oo=+-~;:,. "],
    }
    static DEFAULT_CHARACTER_SET = ImgToTextConverter.DEFAULT_CHARACTER_SETS.LOW

    constructor(htmlCanvas, resultCB, pxGroupingSize=5, refreshRate=0) {
        this._CVS = new Canvas(htmlCanvas, ()=>{
            if (this._media?.initialized) {
                const mappingResults = this.#mapPixels(this._pxGroupingSize), textResult = this.#getText(mappingResults, this._charSet)
                this._resultCB(textResult)
            } else if (this._media) setTimeout(()=>this._CVS.loopingCB(),100)
        }, refreshRate, null, null, null, true)

        this._resultCB = resultCB
        this._pxGroupingSize = pxGroupingSize||5
        this._charSet = ImgToTextConverter.DEFAULT_CHARACTER_SET
        this._media = null
    }

    loadMedia(mediaSource, size=null, readyCB=null, errorCB=null) {
        const isStatic = this._CVS.fpsLimit=="static"
        this._media = new ImageDisplay(mediaSource, [0,0], size, errorCB, ()=>{
            if (isStatic) this._CVS.draw()
            if (readyCB) readyCB(this)
        }, null, null, true)
        this._CVS.add(this._media)

        if (isStatic) this._CVS.initializeStatic()
        else this._CVS.start()
    }

    #mapPixels(pxGroupingSize=5) {
        let CVS = this._CVS, media = this._media, width = media.width>>0, height = media.height>>0, data = CVS.ctx.getImageData(0, 0, width, height).data,
            x, y, atY, atX, atI, pxGroupingCount = (pxGroupingSize**2)*4, bigPxCountX = width/pxGroupingSize, bigPxCountY = height/pxGroupingSize, bigPixels = [], ceil = Math.ceil

            for (y=0;y<height;y+=pxGroupingSize) {
                atY = y*pxGroupingSize
                for (x=0;x<width;x+=pxGroupingSize) {
                    atX = x*pxGroupingSize
                    const overflow = width-(x+pxGroupingSize), bigPx = [], offsetX = ((((atX/pxGroupingSize)/width)*bigPxCountX)*pxGroupingSize*4), offsetY = ((((atY/pxGroupingSize)/height)*bigPxCountY)*pxGroupingCount*bigPxCountX)
                    
                    for (let i=0,adjust=0;i<pxGroupingCount;i+=4) {
                        if (!((i/4)%pxGroupingSize)&&i) adjust = (width*4)*((i/pxGroupingCount)*pxGroupingSize)-i
                        atI = ceil(offsetX+offsetY+i+adjust)

                        const r = data[atI], g = data[atI+1], b = data[atI+2]
                        bigPx.push((r==null || g==null || b==null || (i/4)%(pxGroupingSize) >= pxGroupingSize+overflow) ? null : (r+g+b)/3)
                    }

                    let b_ll = bigPx.length, total=0, nullCount=0
                    for (let i=0;i<b_ll;i++) {
                        const pxAvg = bigPx[i]
                        if (pxAvg==null) nullCount++
                        else total+=pxAvg
                    }
                    bigPixels.push({x, y, avg:total/(b_ll-nullCount)||0})// TODO optimize
                }
            }

        return bigPixels
    }

    #getText(pixelMappingResults, chars) {
        const range = [0], c_ll = chars.length, rangeDivision = 255/c_ll, p_ll = pixelMappingResults.length
        for (let i=1;i<c_ll;i++) range[i] = range[i-1]+rangeDivision


        let textResults = "", lastY=0
        for (let i=0;i<p_ll;i++) {
            let bigPx = pixelMappingResults[i], y = bigPx.y, avg = bigPx.avg, atValue = -1, charIndex = 0

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
        getBestRsolution()

        ---GIVEN---
        - letterSpacing (0px)
        - line height (18px)
        - font-size (16px)
        - groupingSize (5px)

        - media width
        - media height

        (MAYBE) a max width/height
    
    
    
    */




}