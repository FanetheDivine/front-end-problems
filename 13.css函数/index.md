# CSS函数
必须在运算符两边留空格
```css
.test{
    width:calc(100% - 20px);
}
```
必须参与另一个运算或直接作为结果 不能进行拼接
```css
.test{
    --width:20;
    width:calc(var(--width) + 20)px;/*错误 不能拼接 */
    width:calc(calc(var(--width) * 1px) + 20px);/*正确 */
}
```
不能在结果前加负号
```css
.test{
    --width:20;
    width:calc(-var(--width) * 1px);/*错误 */
    width:calc(var(--width) * -1px);/*正确 */
}
```