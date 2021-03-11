# 接口管理系统 - API Mocker

**Hi all，好久不见！API Mocker重新开始维护了，也许不会太快，但一直都在～**

> API Mocker，不仅仅是Mocker，它致力于解决前后端开发协作过程中出现的各类问题，提高开发效率，对接口做统一管理，同时也能为后续的迭代维护提供更便捷的方式。

## 目录
- [系统功能](#系统功能)
- [技术栈与第三方库](#技术栈与第三方库)
- [安装与启动](#安装与启动)
- [部署相关](#部署相关)

## 系统功能

### 接口约定

API Mocker提供操作简单但功能丰富的接口编辑，接口约定者能方便的设置接口的各类信息，其中：

- 结构化的接口参数输入与输出
  - 支持不同维度的请求参数约定（`query`，`body`，`path`, `header`）
  - 支持参数的类型约定（`string`，`number`，`boolean`，`object`，`array`）
  - 参数备注、示例
- 支持Json数据逆向生成参数结构
- 保留一定接口历史记录

![](https://user-gold-cdn.xitu.io/2017/9/15/e4728e628394957924f586517e8d8b1b)

### Mock数据

API Mocker认为，mock不仅仅体现在返回数据中，mock请求本身也应该符合接口约定。因此，我们提供更加符合业务场景的mock服务。

- Mock请求会根据接口约定，自动生成假数据。
- Mock请求会根据接口约定，对请求参数做校验。（校验是否选填、参数类型是否正确）。
- 根据接口约定与用户设置，能模拟不同的网络响应状态，如：`200`，`404`，`500`。
- 支持接口代理，代理mock请求到线上or测试地址，避免开发环境跨域，省下Charles代理过程。
- 支持[Mock.js](http://mockjs.com/)语法。

### 接口文档

API Mocker会根据接口约定自动生成简洁优美、结构清晰的接口文档。同时，可以订阅接口，当接口发生变化时，及时收到邮件通知；也可以按组订阅接口，当组内接口发生修改、增加、删除时，能收到相应的邮件通知。

![](https://user-gold-cdn.xitu.io/2017/9/15/bf8a8ab4587aae27ea45047b05de8df7)

### 接口权限

API Mocker提供简单易用的权限控制。

- 组级别、API级别控制
- 可见性、可写性权限控制

### 其他功能点

- 接口测试。开发人员可以在系统上直接测试接口，避免在postman等请求工具上又填写众多参数
- 便捷的接口搜索。（可以按接口地址、管理员等维度搜索接口）
- 数据呈现
- 支持rap的导入

***

## 技术栈与第三方库

* ES6
* ESLint (Standard)
* [Ramda](https://github.com/ramda/ramda)

### Client

* [Vue](https://github.com/vuejs/vue)全家桶（vue + vuex + vue-router + webpack）
* [ElementUI](https://github.com/ElemeFE/element), [Mock.js](https://github.com/nuysoft/Mock), etc...
* Less

### Server

* [Egg](https://github.com/eggjs/egg), [Koa](https://github.com/koajs/koa)
* [MongoDB](https://github.com/mongodb/mongo)
* [Mongoose](https://github.com/Automattic/mongoose)

***

## 安装与启动

安装依赖外部命令(`mongod`)

* `make install`

同时该命令也会确保`mongod`的启动，如果未启动会在本地建立`db`目录，并启动`mongod`.
如果服务器新开机可重新执行`make install`确保数据库启动.

## 开发启动(dev)

### Client

* `make client` 或者  `cd client && npm install && npm run dev`

### Server

* `make server` 或者 `cd server && npm install && npm run dev`

## 发布启动(prods)

### Client

* `make prod_client` 或者 `cd client && npm install && npm run build`

### Server

* `make prod_server` 或者 `cd server && npm install && npm start`

默认端口号为7001

***


## 部署相关

### 环境要求
```json
"node": ">= 6.0.0",
"npm": ">= 3.0.0"
```
### Config - Server

需要https支持的话，证书路径的配置在入口 `server/index.js` 中。其他服务端的配置都在 `server/config`目录下。其中：

`clientRoot`: 客户端地址，目前仅在发送提示邮件中有作用;

`transporter`: 邮件推送的相关配置，请设置自己推送邮箱。有些邮件服务商安全策略比价高，会发生推送错误，请自行充分测试。如果未配置，则系统不推送提示邮件;

`pushInterval`: 邮件推送的时间间隔配置。目前仅只针对api修改这一项配置；

`mongoose`: mongoDB的相关配置;

`bodyParser.jsonLimit`: 接口请求信息最大限制。因为接口更新时，数据量比较大，所以得设置一下。

其他相关配置，请看文件注释以及egg.js文档中[相关内容](https://eggjs.org/zh-cn/basics/config.html#container)。


### Config - Client

客户端配置在 `client/config/index.js` 中。其中：

`docsUrl`: 文档地址，可自行配置到自己的git仓库；

`serverRoot`: 服务端接口根路径;

`assetsPublicPath`: 静态文件公共路径，所有的静态文件资源地址，以此路径开头。请根据自身发布需求配置。

其他相关配置，请参考vue-cli脚手架[webpack模板](https://github.com/vuejs-templates/webpack)

### **以nginx做部署步骤示例**

假设api-mocker项目文件夹路径为 `__api_mocker_path`

1. 发布启动(prods)，请参考上述执行命令
2. nginx添加配置项：
```bash
server {

        listen       80;
        server_name  localhost;
        
        location / {
            root __api_mocker_path/client/dist/;
            index index.html index.htm test-vue.html;
            try_files $uri $uri/ /index.html =404;
        }

        location /mock-api/ {
            proxy_pass http://127.0.0.1:7001/;
        }
}
```
3. 访问`http://localhost`
