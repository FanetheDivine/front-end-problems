# 问题
要求实际渲染一个dom 但不让用户感知到<br>
需要这个dom的渲染结果和能力 例如渲染后的宽高和输入框输入文字的能力<br>
但这些内容仅应在网页内部进行 不应被用户感知到<br>
# 解决
将dom用容器包裹。将容器宽高设为0 overflow设为hidden即可
``` css
.container{
    width:0;
    height:0;
    overflow:hidden;
}
```
被此容器包裹的dom会实际渲染 但不会被用户感知
# 说明
这个需求的场景之一就是bootstrap的文本编辑器<br>
为了实现一些复杂功能 必须模拟光标<br>
但是window.getSelection只提供被点击/选中字符的数量 不提供像素信息<br>
所以需要取得对应dom的文字 实际渲染出来 以得到光标的位置<br>
此外 还隐藏了一个textarea来实现输入功能<br>