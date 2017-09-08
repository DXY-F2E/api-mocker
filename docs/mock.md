## 关于Mock

系统引用了[Mock.js](http://mockjs.com/),拥有了mock随机假数据的能力。但本系统强调接口管理本身，在假数据上不过分引导与强调。

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

如果没有设置`Response`的`Example`，则会根据对应`Schema`产生mock数据。生成mock数据时，会优先使用`schema`参数的示例值，若示例值未填写，则字符串值为`value`，`boolean`与`number`会随机。例如：
```javascript
// schema
{
  success: String, // example = true
  counts: Number // no example
  items: [{
    id: String // example = e9da9ae33va9f
    name: String // no example
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


