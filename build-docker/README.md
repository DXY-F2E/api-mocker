# 生成Docker镜像

## 使用docker-compose启动

```
> cd build-docker
> docker-compose -f ./api-compose.yml build
> docker-compose -f ./api-compose.yml up
```

## 单独Build启动

### client

```
> cd build-docker/client
> docker build -t api-client .
> docker run --rm api-client
```

### server

```
# 启动mongo
> cd build-docker/mongo
> docker build -t api-mongo .
> docker create --name api-mongo-container api-mongo
> docker start api-mongo-container

> cd ..

# 启动server
> cd build-docker/server
> docker build -t api-server .
> docker run --rm --net="container:api-mongo-container" -p 8080:80 api-server
```
