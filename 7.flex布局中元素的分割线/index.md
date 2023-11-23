# 问题
在flex布局中 为元素添加分割线
# 解决
实际上就是常规三栏布局中 1不变块+2可动块的组合
``` less
.container{
    display:flex;

    .item{
        flex:1;/**或者你喜欢的值 */
    }

    .line{
        flex:0 0 auto;
        height:100%;
        width:2px;
        background-color:white;
    }
}
```
在这个样式中, .item是常规元素, .line是分割线元素
# 说明
`fle`x属性是一个复合属性, 它包括`flex-grow`, `flex-shrink`, `flex-basis`  
`flex-grow` 定义了在主轴方向上的伸缩性  
`flex-shrink` 定义了在主轴方向上的收缩性   
`flex-basis` 定义了在主轴方向上的基础值  
实际上 `flex`默认值`flex:1` 就是 `flex:1 0 auto`  
即 每个元素占据其基础值 剩余空间按照`flex-grow`的比例进行分配  
`flex`和`justify-content` 都对元素在主轴占据的空间进行了规定 有一定冲突