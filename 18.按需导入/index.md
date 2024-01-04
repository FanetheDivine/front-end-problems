# 按需导入
## 方法
``` ts
import cloneDeep from "lodash/cloneDeep";
```
以下两种导入方式都导入了整个包
```ts
import _ from "lodash";

import { cloneDeep } from "lodash";
```
## 说明
部分打包框架可以在不按需导入的情况下也只打包被引用的内容。这个功能叫做树摇tree shaking,例如rollup。