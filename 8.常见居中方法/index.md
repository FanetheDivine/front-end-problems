# 问题
常见的居中方法
# 解决
## 1.position+transform
``` less
.container{
    position: relative;
    .center{
        position: absolute;
        inset: 50% auto auto 50%;
        transform: translate(-50%, -50%);
    }
}
```
## 2.flex
``` less
.container{
    display: flex;
    justify-content: center;
    align-items: center;
}
```
## 3.margin
自动均匀分配外边距
``` less
.center{
    margin:auto;
}
```
## 4.text-align(-last)
文字居中
``` less
.container{
    text-align: center;
}
```
单行文字均匀排布
``` less
.container{
    text-align-last: justify;
}
```
