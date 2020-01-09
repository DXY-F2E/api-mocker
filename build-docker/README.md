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
> cd ..
> docker build -t api-client -f build-docker/client.dockerfile .
> docker run --rm api-client
```

### server

```
# 启动mongo
> cd ..
> docker build -t api-mongo -f build-docker/mongo.dockerfile .
> docker create --name api-mongo-container api-mongo
> docker start -p 8080:80 api-mongo-container

> cd ..

# 启动server
> cd ..
> docker build -t api-server -f build-docker/server.dockerfile .
> docker run --rm --net="container:api-mongo-container" api-server
```
