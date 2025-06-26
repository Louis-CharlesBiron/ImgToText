
const converter = new ImgToTextConverter()

function convertNewImg(img) {
    converter.loadImg(img)

    setTimeout(()=>{///todo
        const res1 = converter.mapPixels(),
        res2 = converter.convertToText(res1)

        console.log(
            res1//, res2
        )

        showGeneratedText.value = res2
    },250)



}

// Manual img load
imgInput.oninput=()=>{
    const file = imgInput.files[0]
    if (file) {
        const fileReader = new FileReader()
        fileReader.onload=e=>{
            imgPreview.src = e.target.result
            convertNewImg(imgPreview)
        }
        fileReader.readAsDataURL(file)
    }
}
