export {
    getVideoScreenshot,
    recordVideo,
}

/**
 * 将video元素当前的画面保存为base64数据
 * @param video video元素
 * @returns base64数据
 */
function getVideoScreenshot(video:HTMLVideoElement){
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if(!context)
        throw new Error('无法取得Canvas元素的Context')
    context.drawImage(video,0,0,video.videoWidth,video.videoHeight)
    return canvas.toDataURL()
}

/**
 * 录制指定时长并取得结果的Promise
 * @param video video元素
 * @param period 录制时长(毫秒)
 * @returns Promise的值为指向录制结果的临时URL  
 * 使用结束后应当以这个URL为参数调用`URL.revokeObjectURL`避免内存泄漏
 */
function recordVideo(video:HTMLVideoElement,period:number):Promise<string>;

/**
 * 录制直到调用**录制控制函数**(*此函数的返回值*)  
 * 如果录制中有异常,立刻终止录制并参数`handler`  
 * 此后调用**录制控制函数** 会抛出异常
 * @param video video元素
 * @param handler 发生异常时立刻终止录制并以异常事件为参数调用此函数
 * @returns 录制控制函数。调用此函数会中止录制并取得指向结果的临时URL  
 * 使用结束后应当以这个URL为参数调用`URL.revokeObjectURL`避免内存泄漏
 */
function recordVideo(video:HTMLVideoElement,handler:(e?:Event)=>void):()=>string;

function recordVideo(video:HTMLVideoElement,periodOrHandler:number|((e?:Event)=>void)){
    let mediaRecorder:MediaRecorder
    try{
        mediaRecorder = new MediaRecorder((video as any).captureStream())
    }catch{
        throw new Error('浏览器版本过低,不支持HTMLMediaElement.captureStream')
    }
    if(typeof periodOrHandler==='number'){
        const period = periodOrHandler
        return recordWithPeriod(mediaRecorder,period)
    }else{
        const handler = periodOrHandler
        return recordWithoutPeriod(mediaRecorder,handler)
    }

}

/**
 * 指定时长时,直接取得录制结果
 * @param mediaRecorder 已指定流的录制器
 * @param period 录制时长(毫秒)
 * @returns Promise的值为录制结果的临时URL  
 * 使用结束后应当以这个URL为参数调用`URL.revokeObjectURL`避免内存泄漏
 */
function recordWithPeriod(mediaRecorder:MediaRecorder,period:number){
    const result:Blob[] = []
    const recorderError = new Error('录制过程出现异常')
    return new Promise<string>((resolve,reject)=>{
        const timer = setTimeout(()=>{
            mediaRecorder.stop()
            resolve(URL.createObjectURL(new Blob(result)))
        },period)
        mediaRecorder.addEventListener('dataavailable',e=>{
            if(e.data.size>0){
                result.push(e.data)
            }
        })
        mediaRecorder.addEventListener('error',e=>{
            mediaRecorder.stop()
            clearTimeout(timer)
            reject(recorderError)
        })
        mediaRecorder.start()
    })
}

/**
 * 未指定录制时长时,取得录制控制器
 * @param mediaRecorder 已指定流的录制器
 * @param handler 发生异常时立刻终止录制并以异常事件为参数调用此函数
 * @returns 调用此函数会中止录制并取得指向结果的临时URL  
 * 使用结束后应当以这个URL为参数调用`URL.revokeObjectURL`避免内存泄漏
 */
function recordWithoutPeriod(mediaRecorder: MediaRecorder, handler: (e?:Event) => void) {
    const result:Blob[] = []
    let isError = false
    mediaRecorder.addEventListener('dataavailable',e=>{
        if(e.data.size>0){
            result.push(e.data)
        }
    })
    mediaRecorder.addEventListener('error',e=>{
        mediaRecorder.stop()
        handler(e)
    })
    function stopRecord(){
        if(isError){
            throw new Error('录制过程出现异常')
        }else{
            mediaRecorder.stop()
            return URL.createObjectURL(new Blob(result))
        }
        
    }
    return stopRecord
}