
const converter = new ImgToTextConverter(document.getElementById("imgInputDisplay"), (text)=>showGeneratedText.value=text, 5, 0)

// FILE INPUT
imgInput.oninput=()=>{
    const file = imgInput.files[0]
    if (file) {
        if (file.name.endsWith(".mp4")) {
            const video = document.createElement("video"), url = URL.createObjectURL(file)
            video.src = url
            video.loop = true
            video.play()
            converter.loadMedia(video, ["35%", "35%"])

            converter._CVS.fpsLimit = 30
            converter._CVS.start()
        } else {
            const fileReader = new FileReader()
            fileReader.onload=e=>{
                const img = new Image()
                img.src = e.target.result
                converter.loadMedia(img, ["35%", "35%"])
            }
            fileReader.readAsDataURL(file)
        }
    }
}

// CAMERA CAPTURE INPUT
camBtn.onclick=()=>{
    converter.loadMedia(ImageDisplay.loadCamera(), ["65%", "65%"])
    converter._CVS.fpsLimit = 30
    converter._CVS.start()
}

// SCREEN CAPTURE INPUT
screenBtn.onclick=()=>{
    converter.loadMedia(ImageDisplay.loadCapture(), ["65%", "65%"])
    converter._CVS.fpsLimit = 30
    converter._CVS.start()
}


// SLIDER SETTINGS
const settingsBlocks = [
    [pxGroupingSlider, manualPxGrouping, pxGroupingValue, (value)=>{
        converter._pxGroupingSize = value
        converter._CVS.loopingCB()
        return "x"+value
    }],
    [letterSpacingSlider, manualLetterSpacing, letterSpacingValue, (value)=>{showGeneratedText.style.letterSpacing = value+"px"}],
    [lineHeightSlider, manualLineHeight, lineHeightValue, (value)=>{showGeneratedText.style.lineHeight = value+"px"}],
    [fontSizeSlider, manualFontSize, fontSizeValue, (value)=>{showGeneratedText.style.fontSize = value+"px"}],
]

settingsBlocks.forEach((els)=>{
    els[0].oninput=e=>{
        const v = +e.target.value
        els[2].textContent = els[3](v)||v
        els[1].value = v
    }
    els[1].oninput=e=>{
        const v = +e.target.value
        els[2].textContent = els[3](v)||v
        els[1].value = v
    }
})



// CHARS INPUT
charsInput.value = converter._charSet
charsInput.oninput=e=>{
    converter._charSet = e.target.value
    converter._CVS.loopingCB()
}

Object.entries(ImgToTextConverter.DEFAULT_CHARACTER_SETS).forEach(([name, chars])=>{
    const option = document.createElement("option")
    option.textContent = name
    option.value = chars

    defaultChars.appendChild(option)
})

defaultChars.value = ImgToTextConverter.DEFAULT_CHARACTER_SET
defaultChars.oninput=e=>{
    charsInput.value = converter._charSet = e.target.value
    converter._CVS.loopingCB()
}




