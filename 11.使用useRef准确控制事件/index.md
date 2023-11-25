# 问题
一个按钮,绑定一个代价高昂的事件,在上一次点击按钮触发的事件结束前,再次点击按钮应当不触发事件
# 解决
在类组件中可以通过设置类属性来处理这个问题
``` ts
<span onClick={()=>{
    if(this.clicked){
        return
    }else{
        this.clicked=true
        this.setState({
            disabled:true
        })
        doSomething().then(()=>{
            
            this.setState({
                disabled:false
            },()=>{
                this.clicked=false
            })
        })
    }
}} style={this.state.disabled?styles.disabled:null}>click</span>
```
函数组件没有每个组件示例可用的属性 使用`useRef`处理这个问题
``` ts
import {useEffect,useRef} from 'react'
import styles from './styles'

export default function Test (){
    const [disabled,setDisabled] = useState(false)
    const clicked = useRef(false)
    useEffect(()=>{
        if(!disabled){
            clicked.current = true
        }
    },[disabled])
    return (
        <span onClick={()=>{
            if(clicked.current){
                return
            }
            clicked.current=true
            setDisabled(true)
            doSometing().then(()=>{
                setDisabled(false)
            })
        }} styles={disabled?styles.disabled:null}>
            click
        </span>
    )
}
```
这种写法可以确保点击按钮立刻更改状态避免重复触发事件   
也确保在按钮被禁用时用户的点击不会触发事件  
# 关于useRef
## 直接使用
`const ref = useRef(initValue)`获取`ref`后,`ref.current`就仅随手动赋值而变动  
并且`ref.current`不会引起组件重新渲染 也不应该监听它的值
可以像上节示例一样为函数组件获取一个同步值 也可以用它保存上一次渲染的某个`state`
```ts
import { useEffect, useState, useRef } from "react"
export default function Test() {
    const [count, setCount] = useState(0)
    const countRef = useRef(count)
    useEffect(() => {
            countRef.current = count
    }, [count])
    return (
        <div onClick={()=>{setCount(count+1)}} >
            本次{count}
            上次{countRef.current}
        </div>
    )
}
```
## 取得引用
```ts
import { useRef } from "react"
export default function Test() {
    const ref = useRef<HTMLElement>()
    return (
        <div ref={ el=> {
            if(el) {
              ref.current = el
            }
        }}>
            test
        </div>
    )
}
```
通过这种方式可以取得DOM或者子组件的引用  
应当注意 使用子组件的引用是具有危险性和复杂性的
## `forwardRef`和`useImperativeHandle`
函数组件使用`useImperativeHandle`自定义暴露给父组件的实例值
```ts
import { useImperativeHandle,forwardRef} from "react"
export default forwardRef(function Test(props,ref) {
    const [count, setCount] = useState(0)
    const expose = {
        setCount
    }
    useImperativeHandle(ref,() => expose)
    return (
        <div>
            {count}
        </div>
    )
})
```
`useImperativeHandle`第三个参数接受一个数组,意义和`useEffect`的第二个参数一样,但此处react不推荐使用空数组
