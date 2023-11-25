# 说明
仅适用于浏览器端 node端api有所区别
# 流式接受数据
浏览器响应网络请求分为两个阶段,响应头阶段和响应体阶段   
`fetch`发起的网络请求明确给出两个阶段的promise  
而`XMLHttpRequest`发起的网络请求只会在请求完全完成的时候触发事件  
因此只能使用`fetch`进行流式接受数据
``` js
fetch(url).then(async res=>{
    const reader = res.body.getReader()
    while(true){
        const {value,done} = await reader.read()
        //处理数据
        if(done){
            break
        }
    }
})
```
## 文本数据流
如果希望得到文字 则应进行编码
```js
const decoder = new TextDecoder();//循环外创建编码器

//...
    const text = decoder.decode(value, { stream: true });//循环内 按照流式数据进行编码
    //处理文本
```
## 媒体数据流
如果希望流式播放媒体 则应结合`MediaSource`
```js
const video = document.querySelector('video')
const mediaSource = new MediaSource()
video.src = URL.createObjectURL(mediaSource)
mediaSource.addEventListener("sourceopen",sourceOpen);

function sourceOpen(){
    const mimeCode = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCode)//这个参数仅作示例

    let updateEndResolve
    sourceBuffer.addEventListener('updateend',()=>updateEndResolve())

    fetch(url).then(async res=>{
        const reader = res.body.getReader()
        let resolve
        while(true){
            const {value,done} = await reader.read()
            const updateEnd = new Promise(resolve=>updateEndResolve=resolve)
            sourceBuffer.appendBuffer(value)
            await updateEnd//只有触发updateend事件后才能像SourceBuffer实例内加入下一个块
            if(done){
                mediaSource.endOfStream()
                break
            }
        }
    })
}
```
# 流式上传数据
一般来说,请求体较大时会自动以流的形式传输数据 这个流被浏览器作为阅读者所占据 
因此无法直接通过流来监听传输进度  只能监听网络请求发起者触发的事件  
但是`fetch`应用了promise 只能反映传输是否完成 无法以事件的形式告知进度  
因此需要使用`XMLHttpRequest`监听进度
可以监听`XMLHttpRequest`对象的`progress`事件获取上传进度