# 问题
```ts
class Test {
    fun(num: number){
        console.log(num)
    }
}
```
通过类型运算 取得`fun`的类型
# 解决
在typescript中,类型只能在类型间进行运算,不能取到它的原型  
但是对于一个类来说(例如示例的`Test`类),它的类名有两个含义  
既指类的实例的类型,也指一个可以生成该类型实例的对象  
```ts
let test:Test// 用作一个类型
typeof test// Test类型

Test.prototype.fun// 用作可以生成Test类型实例的对象
typeof Test// 类类型
```
第二种用法就是typescrpit中的`类类型`
也可从类类型中得到它的实例的类型  
但需要注意的是
```ts
type Test = InstanceType<typeof Test>
```
# 说明
如果一个类通过`import type`导入 那么它不能当作类类型使用