# 问题
在next.js项目中缓存或不缓存页面、网络请求的方法
# 策略
## 服务端缓存网络请求
服务端组件使用的fetch是next特制的   
默认`cache:'force-cache'` 可以指定为`'no-cache'`禁用缓存    
## 客户端缓存网络请求
使用`useSWR`控制客户端对网络请求结果的缓存和统一  
``` ts
'use client'

import { useSWR } from 'swr'

const { data, error } = useSWR<Data>(url,url=>fetch(url).then(res=>res.json()))
```
每次执行`useSWR`都会返回之前的请求结果 并发起一个新的请求 用新请求的响应更新状态  
需要`useSWR`的情况下 可以对每种数据封装一个钩子  
`useSWR`并不只能缓存网络请求 实际上它也可以用作全局的状态管理  
## 缓存一个页面
next.js的页面(page)默认不会被浏览器缓存,地址栏URL相同时刷新网页也会重新发起请求
## 静态页面生成
如果一个服务端组件内没有*不使用缓存的fetch*,那么这个组件的函数只在打包时执行一次