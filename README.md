# 接口约定测试系统
> api-mocker

后端文档地址: https://shimo.im/doc/hkh0xIhTHVUnc1CQ


## Install

安装依赖外部命令(`mongod`)

* `make install`


## 开发启动(dev)

### Client

* `make client`

### Server

* `make server`

## 发布启动(prods)

### Client

* `make prod_client`

资源文件会放在`./dist/`下面(注: 不是 `./client/dist`)，直接进行nginx托管即可

### Server

* `make prod_server`

使用pm2启动server, 端口号为7001