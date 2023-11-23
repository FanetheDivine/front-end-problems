# 问题
JS对数字常见的操作
# 解决
## 取整
``` javascript
Math.floor(number)//向下取整
Math.ceil(number)//向上取整
```
number=>number
## 保留小数
``` javascript
number.toFixed(1)//保留1位小数
```
number=>string
## 日期间隔
``` javascript
date1-date2//日期间隔 毫秒
```
(Date,Date)=>number
## 日期格式化
``` javascript
date.toLocaleString()// yyyy/MM/dd hh:mm:ss
date.toLocaleDateString()// yyyy/mm/dd
date.toLocaleTimeString()// hh:mm:ss
```
Date=>string