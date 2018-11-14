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


### 设置返回
* api-mocker 可以为一个 mock 接口配置多种 response。可以在系统中切换，也可以在请求时带上 query 参数 __api_mock_status__ 来指定返回配置 response 中的哪个（__api_mock_status__ 为索引值）。   
当两者都配置时以 __api_mock_status__ 参数为准。