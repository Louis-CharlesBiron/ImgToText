
class ImgToTextConverter {
    static RESOLUTIONS = {SD:[640, 480], HD:[1280, 720], FULL_HD:[1920, 1080], "4K":[3840,2160], FOURK:[3840,2160], MAX:[3840,2160]}

    constructor() {
        
    }

    loadImg(imgElement, resolution=null) {
        resolution||=[imgElement.width, imgElement.height]
        this._canvas = new OffscreenCanvas(resolution[0], resolution[1])
        this._ctx = this._canvas.getContext("2d")
        this._ctx.drawImage(imgElement, 0, 0)
    }

    //red: (236, 28, 36, 1)
    //black: (24, 24, 24, 1)
    //grey: (195, 195, 195, 1)
    //pink: (184, 61, 186, 1)
    //blue: (63, 72, 204, 1)
    //yellow: (255, 242, 0, 1)

    convertToText(pxGroupingSize=4) {
        let width = this._canvas.width, height = this._canvas.height, data = this._ctx.getImageData(0, 0, width, height).data,
            x, y, atY, atX, atI, pxGroupingCount = (pxGroupingSize**2)*4, bigPxCountX = width/pxGroupingSize, bigPxCountY = height/pxGroupingSize,
            bigPixels = []

            console.log("total px:", height*width/pxGroupingSize, "("+height*width+")", width, height, bigPxCountX, bigPxCountY)

            for (y=0;y<height;y+=pxGroupingSize) {
                atY = y*pxGroupingSize
                console.log("---", atY, height, width, pxGroupingSize)
                for (x=0;x<width;x+=pxGroupingSize) {
                    atX = x*pxGroupingSize

                    const overflow = width-(x+pxGroupingSize)

                    console.log("OVERFLOW", overflow)

                    console.log("NEW BIG PIXEL ↓ ("+atX+", "+atY+")")
                    let bigPx = []
                    for (let i=0,adjust=0;i<pxGroupingCount;i+=4) {

                        if (!((i/4)%pxGroupingSize)&&i) {
                            adjust = (width*4)-i
                            console.log("line: ", adjust, atX, atY, i)
                        }
                        atI = ((((atY/pxGroupingSize)/height)*bigPxCountY)*pxGroupingCount*bigPxCountX)+((((atX/pxGroupingSize)/width)*bigPxCountX)*pxGroupingSize*4)+i+adjust
                        
                        if ((i/4)%(pxGroupingSize) >= pxGroupingSize+overflow) bigPx.push([null, null, null])
                        else bigPx.push([data[atI], data[atI+1], data[atI+2]])

                       console.log("v: ", data[atI], data[atI+1], data[atI+2], data[atI+3], "|", atX, atY, "|", atI, i/4, overflow, i%(pxGroupingSize) >= pxGroupingSize+overflow,)
                    }
                    bigPixels.push(bigPx)

            }
        }

        return bigPixels
    }

}