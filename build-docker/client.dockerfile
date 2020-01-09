FROM nginx:alpine

## Clone Source
COPY ./client/dist /www
COPY ./build-docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /www

## Expost ports
EXPOSE 80

CMD "nginx" "-g 'daemon off;'"
