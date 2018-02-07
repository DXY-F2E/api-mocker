from node:alpine

COPY ./server /server

RUN cd /server && \
    npm install

WORKDIR /server

CMD "npm" "start"
