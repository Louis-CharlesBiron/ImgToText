self.onmessage=e=>{
    console.log(e)
}

const converter = new ImageToTextConverter((text)=>self.postMessage(text), "CDEJS")
