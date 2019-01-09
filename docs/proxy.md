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
