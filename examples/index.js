const {ImageToTextConverter} = window.ImgToText, {ImageDisplay} = window.CDE

const converter = new ImageToTextConverter((text)=>showGeneratedText.value=text, null, document.getElementById("imgInputDisplay"))


// FILE INPUT
converter.createHTMLFileInput(imgInput)

// CAMERA CAPTURE INPUT
camBtn.onclick=()=>{
    converter.loadMedia(ImageDisplay.loadCamera())
    imgInput.value = ""
}

// SCREEN CAPTURE INPUT
screenBtn.onclick=()=>{
    converter.loadMedia(ImageDisplay.loadCapture())
    imgInput.value = ""
}


// SLIDER SETTINGS
const settingsBlocks = [
    [pxGroupingSlider, manualPxGrouping, pxGroupingValue, (value)=>{
        converter.pxGroupingSize = value
        converter.generate()
        return "x"+value
    }],
    [letterSpacingSlider, manualLetterSpacing, letterSpacingValue, (value)=>{showGeneratedText.style.letterSpacing = value+"px"}],
    [lineHeightSlider, manualLineHeight, lineHeightValue, (value)=>{showGeneratedText.style.lineHeight = value+"px"}],
    [fontSizeSlider, manualFontSize, fontSizeValue, (value)=>{showGeneratedText.style.fontSize = value+"px"}],
    [widthSlider, manualWidth, widthValue, (value)=>{
        if (converter.media) {
            converter.media.size = [value+"%", converter.media.size[1]]
            converter.generate()
        }
        return value+"%"
    }],
    [heightSlider, manualHeight, heightValue, (value)=>{
        if (converter.media) {
            converter.media.size = [converter.media.size[0], value+"%"]
            converter.generate()
        }
        return value+"%"
    }]
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
//charsInput.value = converter.charSet
//charsInput.oninput=e=>{
//    converter.charSet = e.target.value
//    converter.generate()
//}

Object.entries(ImageToTextConverter.DEFAULT_CHARACTER_SETS).forEach(([name, chars])=>{
    const option = document.createElement("option")
    option.textContent = name
    option.value = chars
    defaultChars.appendChild(option)
})

defaultChars.value = ImageToTextConverter.DEFAULT_CHARACTER_SET
defaultChars.oninput=e=>{
    converter.charSet = e.target.value.split(",")
    converter.generate()
}

copyBtn.onclick=()=>{
        if (navigator.clipboard) navigator.clipboard.writeText(showGeneratedText.value.trim())
        showGeneratedText.select()
        showGeneratedText.setSelectionRange(0, 99999)
}