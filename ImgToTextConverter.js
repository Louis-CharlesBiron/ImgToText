
class ImgToTextConverter {
    static DEFAULT_CHARACTER_SET = " .:-~=+oOXHMB8$W%@#░▒▓█"

    constructor() {
        
    }

    loadImg(imgElement, resolution=null) {
        resolution||=[imgElement.width, imgElement.height]
        this._canvas = new OffscreenCanvas(resolution[0], resolution[1])
        this._ctx = this._canvas.getContext("2d")
        this._ctx.drawImage(imgElement, 0, 0)
    }

    mapPixels(pxGroupingSize=5, getRaw=false) {
        let width = this._canvas.width, height = this._canvas.height, data = this._ctx.getImageData(0, 0, width, height).data,
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
                        if (getRaw) bigPx.push((i/4)%(pxGroupingSize) >= pxGroupingSize+overflow ? [null, null, null] : [r, g, b])
                        else bigPx.push(((i/4)%(pxGroupingSize) >= pxGroupingSize+overflow || r==null || g==null || b==null) ? null : (r+g+b)/3)
                    }

                    if (getRaw) bigPixels.push(bigPx)
                    else {
                        let b_ll = bigPx.length, total=0, nullCount=0
                        for (let i=0;i<b_ll;i++) {
                            const pxAvg = bigPx[i]
                            if (pxAvg==null) nullCount++
                            else total+=pxAvg
                        }
                        bigPixels.push({x, y, pxGroupingSize, avg:total/(b_ll-nullCount)})
                    }
                }
            }

        return bigPixels
    }

    convertToText(pixelMappingResults, chars=ImgToTextConverter.DEFAULT_CHARACTER_SET) {
        const range = [0], c_ll = chars.length, range_ll = 255/c_ll, p_ll = pixelMappingResults.length
        for (let i=1;i<range_ll;i++) range[i] = range[i-1]+c_ll

        let textResults = "", lastY=0
        for (let i=0;i<p_ll;i++) {
            const bigPx = pixelMappingResults[i], y = bigPx.y

            if (y != lastY) textResults+="\n"
            textResults += chars[this.#getMappedCharIndex(bigPx.avg, range)]
            lastY = y
        }
        
        return textResults
    }


    #getMappedCharIndex(num, nums) {
        return nums.indexOf(nums.reduce((a,b)=>a<num?b:a,-1))
    }

}