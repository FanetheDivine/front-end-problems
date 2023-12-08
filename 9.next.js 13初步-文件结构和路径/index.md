# 版本信息
基于next.js 13 app目录模式和 typescript 5.2以上版本
# 文件结构
next.js项目app目录及其下的每个文件夹都代表一个路径  
`app`目录代表`/` `app/test`代表 `/test` 以此类推  
下文中用`路径`指代对应的文件路径和url  
路径可以是动态的`/app/[id]/`  
文件夹中可以自由创建react组件和ts函数  
但存在一些对next有特殊意义的文件名称  
## `not-found.tsx` / `error.tsx`
`not-found`仅在app目录下生效 表示未找到的页面   
`error` 表示出错的页面
## `loading.tsx`
布局中的内容加载时,显示`<Loading></Loading>`   
如果需要对页面的某个区域显示loading 则应使用Suspense组件
## `layout.tsx` / `template.tsx` / `page.tsx`
不考虑`not-found.tsx`、`error.tsx`等时 next按照下面的方式组织页面  
``` html
<Layout>
    <Template>
        <Page></Page>
    </Template>
</Layout>
```
如果路径指向子页面,那么子页面按照这种方式组织后会取代`<Page></Page>`  
相应的,当前页面组织后也会取代上级页面的`Page`,嵌入其`Template`和`Layout`中  
路径在子路径间变化时,`Layout`是不重新渲染的(如果`Layout`有状态,状态会重新渲染),而`Template`会重新渲染。  
`Layout`和`Template`不是必须的,但只有`Page`的存在才能让next认为当前路径是一个页面 
对于`/[id]?name=1`  访问参数的方式如下
``` ts
type Props = {
    params:{//路径参数
        id:string
    },
    searchParams:{//查询参数
        name?:string
    }
}
export default function Test(props:Props){
    const id = props.params.id
    const name = props.searchParams.name
    return (
        <div>
            <span>id:{id}</span>
            <span>name:{name}</span>
        </div>
    )
}
```
对于客户端组件,还有更好的方式可供选择
``` ts
'use client'
import {useParams,useSearchParams} from "next/navigation";

type Params = {
    id:string//只能是string或者string[]
}
export default function Test(){
    const { id } = useParams<Params>()//路径参数
    const query = useSearchParams()//查询参数
    return (
        <div>
            <span>id:{id}</span>
            <span>name:{query.get('name')}</span>
        </div>
    )
}
```
路径参数和查询参数的类型 ***无法*** 在编译时确定   
将参数指定为期望类型前应当进行校验  
## `route.ts`
如果此文件存在,那么当前路径不被视为一个页面  
`page.tsx`不生效 但`layout.tsx`和`template.tsx`仍然对子路径生效  
对于路径为`/[id]?name=1` body为`{data:{name:string}}`的POST请求,在route.ts中定义POST函数接受参数  
值得注意的是 请求体和查询是可能*不存在*的   
``` ts
import { NextRequest } from "next/server"

type Params={
    params:{
        name:string
    }
}

type Body = undefined | {
        name?:string
}

export async function POST(req: NextRequest,{params}:Params){
    const id = req.nextUrl.searchParams.get('id')//接受查询参数 使用这种方式要求开发者检测是否存在
    const data:Body = await req.json()//接受请求体 它可能是不存在的
    const name = params.name//接受路径参数 路径参数一定是存在的且类型为字符串
    return Response.json({
        id,
        data,
        name
    })
}
```
服务端收到的请求和浏览器的fetch类似,分为请求头和请求体两个阶段  
调用函数时仅接受了请求头,需要异步地接受请求体  
`req.body`就是请求体的句柄,可用于流式传输
# 路径跳转
## 重定向
``` ts
import { redirect } from "next/navigation"
```
使用绝对路径调用`redirect`进行重定向  
它可以在大部分场景中使用  
`next`没有路由守卫 一般由被跳转的组件自行判断是否允许加载   
## 普通跳转
由用户进行的跳转一般由`<Link></Link>`完成
```ts
import Link from "next/link"
<Link href='/'></Link>
```
`Link`与`a`标签语义相同
## 主动跳转
在*客户端*组件中,使用`useRouter`进行主动跳转
``` ts
'use client'
import { useRouter } from "next/navigation";

const router = useRouter()
router.push('/123?name=1')//只能通过这种方式携带参数
```
`router.push`接受绝对路径  
查询参数的改变不会触发浏览器重新请求 可以用`useEffect`监听
路径参数会触发浏览的重新请求 无法监听
## 刷新、前进和回退
``` ts
'use client'
import { useRouter } from "next/navigation";

const router = useRouter()
router.refresh()//刷新
router.forward()//前进
router.back()//回退
```
与`history.go`不同,`router`系列函数固定只能前进和和回退一次
# 路径简写
如果路径`app/test`下有`/test1`路径   
那么引用它的方式必须是字符串`'/test/test1'`  
这种引用方式和文件目录重复了 也不利于页面迁移   
采用`usePathname`可以避免这个问题
``` ts
'use client'
import { usePathname } from "next/navigation";

const pathname = usePathname()//不包含查询参数
await fetch(`${pathname}/test1`)
```
这个也是客户端组件专享
服务端组件必须写出完整的路径名 或者从`app/api/`获取内容
# 父级路径参数
对于`/[id]/[name]`路径 `/[id]`这一级的`layout.tsx`和`template.tsx`接受的路径参数只有`id`   
下级的所有组件都可以接受`id`和`name`
# 合理地组织项目
从客户端组件和服务端组件不同函数可以看出next.js项目设计的一般原则:静态布局,动态内容   
服务端组件可以使用元数据,适合为一组页面提供布局;客户端组件路由操作丰富,适合为特定页面提供内容