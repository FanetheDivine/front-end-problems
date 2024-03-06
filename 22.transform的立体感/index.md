# 问题
使transform变换更有立体感
# 解决
transform中应用perspective 改变观察者z轴高度
```css
.test{
    transition: 500ms;
    transform: perspective(100px) rotateX(180deg);
}
```
旋转动画会由立体感