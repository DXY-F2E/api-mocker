# API Mocker
API Mocker，不仅仅是mock。最初我们只是想做一个mock server。后来为了提高前后端协同开发效率，不断的演变成如今的接口管理系统。

下面介绍下如何使用该系统。

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

## 关于Mock

### mock规则
系统引用了[Mock.js](http://mockjs.com/)，拥有了mock随机假数据的能力。但本系统强调接口管理本身，在假数据上不过分引导与强调。

如若设置了`Response`的`Example`，则会返回`Example`的值，如果当中写了[Mock.js](http://mockjs.com/examples.html)的语法，则会生成对应的数据。例如

```javascript
// example值为：
{
  "status|1-2": true,
  "number|1-100": 100
}
// 则会生成
{
  "status": false,
  "number": 40
}
// 或
{
  "status": true,
  "number": 99
}
// 或其他随机值
```

如果没有设置`Response`的`Example`，则会根据对应`Schema`产生mock数据。

1. 生成mock数据时，会优先使用`schema`参数的示例值。
2. 若示例值未填写，则`String`类型参数mock数据为`"value"`，`Boolean`与`Number`会随机

```javascript
// schema
{
  success: {
    type: Boolean,
    example: true
  },
  counts: {
    type: Number
  },
  items: [{
    id: {
      type: String,
      example: "e9da9ae33va9f"
    },
    name: {
      type: String
    }
  }]
}
// 会生成
{
  "success": true,
  "counts": 345,
  "items": [{
    "id": "e9da9ae33va9f",
    "name": "value"
  }]
}
```

### 建议
* 如果对于假数据随机性要求不高，不建议写mock语法，也不需要填写`Schema`的`Example`，系统会自动生成假数据。

## 关于代理

api-mocker支持代理mock请求到**线上地址**或者**测试地址**，前提是已经在接口设置中配置对应的地址链接，且为绝对路径。

### 开启代理的两种方法

1. 在接口编辑页左侧的 [**代理转发**] 选项勾选对应的转发规则。
2. 可以在请求Mock URL时，带上query参数来设置：
    - 转发线上：{ mockURL }?_mockProxyStatus=1
    - 转发测试：{ mockURL }?_mockProxyStatus=2

### 代理鉴权

有些接口需要cookie鉴权，而mock地址与线上、测试地址并非同个域名，所以cookie没办法共通。为此api-mocker提供一个配置：mock请求的请求头若设置了字段`api-cookie`，则会使用此字段的值作为代理请求的`cookie`。

故开发阶段可以将某个已鉴权cookie，写至mock请求头的`api-cookie`字段，如示例：
```javascript
$.ajax({
  url: mockUrl,
  method: 'get',
  headers: {
    'api-cookie': 'your cookie of authentication'
  }
})
```

亦或者直接手动将该`cookie`设置到mock请求的域名下，mock服务端会将当前域名的cookie转发到代理请求地址。

> 注：若请求头设置了`api-cookie`，则不会再使用mock请求地址的原本cookie。

## 关于分组

* 系统目前只有一级分组
* 接口必须属于某一且唯一分组

## 关于权限

* 接口创建者即接口管理员
* 分组创建者即分组管理员
* 只有管理员能做权限修改
* 权限分为可读权限与可写权限
* 创建的接口与分组默认对所有人可读可写
* 用户可以成为多个组的组内成员
* 管理员目前不能更改，将来会安排需求完善

## 列表与搜索

* 列表页左侧栏为用户所有可见分组
* 列表页中间为分组内所有可见接口，默认为系统全部可见接口
* 目前能按接口名称、线上地址、测试地址、管理员名字和接口ID来搜索。（（接口ID为mock url中最后一截ObjectId字符串）

## 订阅与推送

* 支持按接口订阅or分组订阅；
* 接口创建者默认订阅接口，其他人需到接口文档页自己订阅；
* 接口发生修改时，推送提醒，连续1小时内的变化不会连续推送（可配置，详情请查阅配置相关的文档）；
* 订阅的分组内接口发生修改、创建或删除时，推送提醒；
* 推送到订阅者注册账户的邮箱；
* 系统的推送邮箱需要配置，请注意由于不同邮件商安全策略不同，请自行调试。

## 快捷键

为了编辑方便，系统有部分快捷键，其中：

* 保存接口：`ctrl + s` 或者 `cmd + s`
* 退出全屏：`ESC`

## 其他常见问题

**Q: 请求Mock URL出现404 not found。**

A: 请先确认请求协议是否正确。为严格定义接口，系统会严格判断请求协议。若发起请求类型不对，接口会返回404。

**Q: query参数类型只有string，number，boolean？**

A: Query参数本质都是字符串，接口为了适应实际需求，还另外加了number与boolean类型的校验，但不支持object与array，若有类似以批量id查询的接口，请以字符串加分隔符的格式传输。

**Q: 如何删除接口？**

A: 鼠标移动到右上角账户名，选择接口管理，可以删除接口。但仅限于接口管理员有权限（接口创建者默认为接口管理员），分组同上。

**若有其他问题，欢迎提[Issues](http://gitlab.dxy.net/f2e/api-mocker/issues)或者PR**

