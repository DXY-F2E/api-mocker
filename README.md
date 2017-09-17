# 接口约定测试系统

> API-Mocker，不仅仅是Mocker

***

## 目录
- [技术栈与第三方库](#技术栈与第三方库)
- [安装与启动](#安装与启动)
- [部署相关](#部署相关)

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

网络域名为 `your-mocker.com`

1. 发布启动(prods)，请参考上述执行命令
2. nginx添加配置项：
```bash
server {

        listen       80;
        server_name  localhost;

        location /mock-api/ {
            proxy_pass http://127.0.0.1:7001/;
        }

        location /mock {
            autoindex on;
            alias __api_mocker_path/client/dist;
        }
}
```
2. 修改`client/config/index.js`文件下的`serverRoot`，改为 `your-mocker.com/mock-api`
3. 访问`http://your-mocker.com/mock`

> 注: 若是服务器带宽较低，可将客户端部署到cdn，配好路由，每次发布重新更新下dist目录下`index.html`文件缓存。或者只把`client/dist/static`目录同步到cdn，自己nginx再做转发配置
