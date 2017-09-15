## 其他常见问题

**Q: 请求Mock URL出现404 not found。**

A: 请先确认请求协议是否正确。为严格定义接口，系统会严格判断请求协议。若发起请求类型不对，接口会返回404。

**Q: query参数类型只有string，number，boolean？**

A: Query参数本质都是字符串，接口为了适应实际需求，还另外加了number与boolean类型的校验，但不支持object与array，若有类似以批量id查询的接口，请以字符串加分隔符的格式传输。

**Q: 如何删除接口？**

A: 鼠标移动到右上角账户名，选择接口管理，可以删除接口。但仅限于接口管理员有权限（接口创建者默认为接口管理员），分组同上。

**若有其他问题，欢迎提[Issues](http://gitlab.dxy.net/f2e/api-mocker/issues)或者PR**
