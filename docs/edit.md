## 创建/编辑 接口

### 必需字段

* 接口名称；
* 接口分组，若无，可根据页面提示创建分组；
* 请求类型，默认选择`GET`；

### 请求约定 - Request

请求约定分为三类请求参数与一个请求头：

* Body: 提交的JSON或者Form数据，若请求类型选择`GET`，则不显示此参数约定
* Query: url参数，例如：https://www.dxy.cn?param=hi
* Path: RESTful风格的url参数，例如：https://www.dxy.cn/:param1/:param2
* Header: 请求头的约定

### 响应约定

* 返回结果可以设置多个，并且自定义对应的名称与状态码，此状态码应该与真实接口状态码保持一致。
* 支持模拟网络延迟
* 如若设置了多个返回值，可以指定返回结果，或者随机结果


### 关于参数结构（Schema）填写

1. 参数属性包括：参数名（key）,参数类型，是否必填，备注，示例值（example）。
2. 基本参数类型有：`string`,`number`,`boolean`,`object`,`array`。
3. Body参数的数据类型，另多一个`file`类型，但目前不做校验支持，只在文档起约定显示作用。
4. Query参数与Header参数只支持`string`类型，因为url与请求头中的数据，都是字符串。
5. 如若参数类型选择对象或者对象数组（`array[object]`），则可以再选择子一级参数。
6. 暂不支持嵌套数组，若选择数组，那么数组里每个值类型都应该一样。

为方便大家理解`Schema`，以及与`Example`的关系，附上 `Schema`的整体json结构。
```javascript
Param = {
  key: String,            // 参数名
  type: String,           // 参数类型，string|number|boolean|object|array
  comment: String,        // 备注
  example: String,        // 参数示例值
  items: {                // 当参数类型为array时，此字段生效
    type: String          // 数组的参数类型
    params: Array[Param]  // 当数组参数类型为object类型时，此字段生效，意义为数组内对象的参数模型
  }
}
Schema = {
  example: Object,
  params: Array[Param]
}
```

### 关于Example

* 每个参数结构体（Schema）都有对应的Example。代表这个参数结构体的示例值。系统支持example与schema的相互转换。
* schema生成example根据mock规则生成，具体可看mock一章。
* example生成schema，会自动判断数据类型，并把值作为参数的example。如若值为null,{},则会认为是选填对象，若为[],则为选填数组。
