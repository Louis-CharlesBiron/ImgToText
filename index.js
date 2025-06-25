
const converter = new ImgToTextConverter()

function convertNewImg(img) {
    converter.loadImg(img)

    console.log(
        converter.convertToText()
    )

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
