
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


    convertToText(pxGroupingSize=4) {
        let width = this._canvas.width, height = this._canvas.height, data = this._ctx.getImageData(0, 0, width, height).data,
            x, y, atY, atX, pxSpacing = 4*width*pxGroupingSize, pxGroupCount = pxGroupingSize**2

            console.log("total px:", height*width)

            for (y=0;y<height;y+=pxGroupingSize) {
                atY = y*pxSpacing
                for (x=0;x<width;x+=pxGroupingSize) {
                    atX = atY+x*4*pxGroupingSize
                    console.log(atX, atY)

                    for (let i=0;i<pxGroupCount;i++) {

                    }



                    //return [x, y]
                }
            }

        return ""
    }

}