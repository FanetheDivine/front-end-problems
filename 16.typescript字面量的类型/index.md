# 问题
typescript元组字面量的类型会退化为元组内元素类型的联合类型的数组   
```ts
function(){
    return [1,'1']//返回值类型是(number|string)[]
}
```
# 解决
使用`as const`语法 阻止类型退化
```ts
const test1 = [1,'1']//(number|string)[]
const test2 = [1,'1'] as const//[1,'1']
```