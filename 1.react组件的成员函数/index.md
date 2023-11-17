# 问题
同事的代码 我认为里面存在this指向的问题
``` javascript
class xx extends React.Component{
    func1=()=>{
        this.xx//func1是箭头函数 this不会指向调用它的对象
    }
    func2=()=>{
        func(this.func1)//没有为func1绑定this
    }
}
```
事实上 这段代码正确运行了 并没有遇到this的问题
# 解释
`问题`中func1的定义等同于
``` javascript
class xx extends React.Component{
    constructor(){
        this.func1=()=>{
            this.xx
        }
    }
}
```
func1是每个对象都具有的属性 而不是原型上的函数<br>
它的this 就是构造函数的this 指向了新对象<br>
由于是箭头函数 所以可以直接作为参数传递 不存在this指向问题