# DSL-CORE

通过api-mocker的schema与请求的参数，生成对应的返回结果

## API

* `buildExampleFromSchema`: 通过[mock.js](http://mockjs.com/)将schema生成mock数据
* `renderer`: 通过请求参数，生成对应返回结果

## 若希望只引用单个api文件，请引用lib目录，如 `var buildExample = require('mocker-dsl-core/lib/buildExampleFromSchema')`

## `renderer` 模板语法

所有的value中包含有 ${...} 的 value，其括号内内容都会识别为模板语言进行编译。例如：
```javascript
// example of schema
{
  test: "${name} render success"
}

// GET {url}?name=dxy

// response
{
  test: "dxy render success"
}
```

* 目前模板语言所支持的变量类型为: string, 例如上例中的name会被当成string进行求值。符号表为请求所传入的参数。
* 模板语法天然支持深层次嵌套使用。
