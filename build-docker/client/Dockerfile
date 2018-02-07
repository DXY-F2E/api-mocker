FROM node:latest

## Install
RUN apt update && \
    apt install -y git nginx

## Clone Source
COPY ./client /client
# RUN git clone --depth 1 https://github.com/DXY-F2E/api-mocker.git /api-mocker

RUN cd /client && \
    npm install && \
    npm run build && \
    mv dist /www && \
    rm -rf /client

COPY ./build-docker/client/nginx.conf /etc/nginx/nginx.conf

WORKDIR /www

## Expost ports
EXPOSE 80

CMD "nginx" "-g 'daemon off;'"
