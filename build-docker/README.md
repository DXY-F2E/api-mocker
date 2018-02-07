# 生成Docker镜像

使用Docker运行有下面两种方式, 推荐使用第一种

## 使用docker-compose启动

```
> cd ../
> npm run docker:build
> npm run docker:start
# client: 8888  # server: 7001
```

## 单独Build启动

### client

```
> cd ./client
> docker build -t api-client .
> docker run --rm api-client
```

### server

```
# 启动mongo
> cd ./mongo
> docker build -t api-mongo .
> docker create --name api-mongo-container api-mongo
> docker start -p 8080:80 api-mongo-container

> cd ..

# 启动server
> cd ./server
> docker build -t api-server .
> docker run --rm --net="container:api-mongo-container" api-server
```
