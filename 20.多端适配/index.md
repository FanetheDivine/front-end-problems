# 问题
网页的多端适配
# 解决
* 读取UA判断设备类型,静态多端适配
* 读取视窗宽度,动态多端适配。一般以786px作为移动端和电脑的分界线。一般使用useMediaQuery。
# Next项目代码示例
可以使用createServerContext(暂时未开放)
```ts
import { headers } from 'next/headers'

const mobileDevices = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini']

/**
 * 判断当前设备是否是移动设备
 * 仅在服务端组件中使用
 */
export function isMobile() {
    const ua = headers().get('user-agent')?.toLocaleLowerCase()
    return Boolean(ua && mobileDevices.some(item => ua.includes(item)))
}
```