# 使用cookie
## 读cookie
仅服务端组件和route
```ts
import { cookies } from 'next/headers'

export default function Page(){
    const cookieStore = cookies()
    cookieStore.get('test')
}
```
## 写cookie
仅server action和route
```ts
'use server'
import { cookies } from 'next/headers'

export default async function setCookie(){
    const cookieStore = cookies()
    cookieStore.set('test','test')
}
```
# server action
在文件顶部使用`'use server'`声明,此文件导出的函数就是`server action`  
```ts
'use server'
import { redirect } from "next/navigation"
export async function serverAction(){
    redirect('/test')
}
```
这些函数必须被声明为`async` 它们严格地运行在服务端  
它的本质是next包装过的表单action(POST请求) 因此可以用在任何fetch也可以使用的位置(客户端组件的组件体就不行)  
可以通过server action统一前后端的数据格式  
`server action`进行重定向时会改变浏览器url(因为底层由表单实现)   
## 注意
只能传输`plain object`,字符串、数字、日期和它们组成的对象以及表单 
不要将其直接指定为事件的值(onClick={serverAction}) 会直接进入error页面  
server action在处理异常 输出日志时有一定困难  
## 通过server action传输文件
### 前端传文件到后端
传
```ts
        <input type='file' onChange={async e => {
          const file = e.target.files?.[0]
          if(file){
            const formData = new FormData()
            formData.set(encodeURI(file.name),file)// 编码中文文件名
            upload(formData).catch(e=>console.log(e.message))
          }
        }}></input>
```
收
```ts
'use server'

import { writeFileSync } from 'fs'
import { File } from 'buffer'

export async function upload(formData: FormData) {
    const [fileName, file] = [...formData.entries()][0]
    if (file instanceof File) {
        writeFileSync(`E:/${decodeURI(fileName)}`, new Uint8Array(await file.arrayBuffer()))
        return 'success'
    }
    return 'failed'
}
```
### 后端传文件到前端
由于浏览器缓存的存在 使用固定路由传文件  
`route.ts`
```ts
import { readFileSync } from "fs";
import { NextResponse } from "next/server"

export async function GET() {
    return new NextResponse(readFileSync('E:/1.png'));
};
```
server action向客户端输送一个blob对象:暂无