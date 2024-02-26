# 在Next.js项目中使用tRPC
## 说明
* Next14引入server action 不需要使用tRPC进行前后端交互
* 更改库的版本可能导致类型问题
## 第三方库
```
    "@tanstack/react-query": "4.36.1",
    "@trpc/client": "10.45.1",
    "@trpc/next": "10.45.1",
    "@trpc/react-query": "10.45.1",
    "@trpc/server": "10.45.1"
```
## 构建和使用trpc
### @/lib/trpc 构建trpc
* `trpc.ts` 导出trpc构建能力
  ```ts
    import { initTRPC } from '@trpc/server'

    export const { procedure, router } = initTRPC.create()
  ```
* `routes/` 定义服务端函数
  `example.ts` 导出服务端函数
  ```ts
    import { z } from "zod";
    import { procedure } from "../trpc";

    export const example = procedure
        .input(z.object({ message: z.union([z.string(), z.number()]) }))
        .query(async opts => {
            return opts.input.message
        })
  ```
* `index.ts` 导出构建完毕的trpc.不能和trpc.ts合并,会导致循环引用
  ```ts
    import { router } from "./trpc"
    import { example } from "./routes/example"

    export const TRPC = router({
    /** 示例 */
    example,
    })
  ```
### @/app/api/trpc/[trpc] 构建路由
route.ts
```ts
import { TRPC } from "@/lib/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",// 与文件路径保持一致
    req,
    router: TRPC,
    createContext: () => ({}),
  });
export { handler as GET, handler as POST };
```
此时 可以在浏览器访问/api/trpc/example 取得example的结果
### @/app/module/components/trpc-context 定义上下文
index.ts
```ts
'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ReactNode, useState } from "react";
import { trpc } from '@/utils/trpc'

type Props = {
    children: ReactNode
}
export function TRPCContext(props: Props) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
        })
    )
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
```
在@/app/layout.tsx中使用此组件包裹children.只有处于trpc上下文的组件可以使用trpc能力
### @/utils/trpc trpc句柄
index.ts
```ts
import { TRPC } from "@/lib/trpc";
import { createTRPCReact } from "@trpc/react-query";

/** 客户端组件用此句柄调用服务端函数获取数据 */
export const trpc = createTRPCReact<typeof TRPC>()
```
### 使用trpc
*客户端组件*内
```ts
import { trpc } from '@/utils/trpc'

// 这里的example就是@/lib/trpc/index.ts里的example
// 鼠标悬浮可以查看tsdoc注释 还可以直接跳转至@/lib/trpc/index.ts
trpc.example.useQuery({ message: 'trpc example' })
```