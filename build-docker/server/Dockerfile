from node:latest

RUN git clone --depth 1 https://github.com/DXY-F2E/api-mocker.git /api-mocker

RUN cd /api-mocker/server && \
    npm install

WORKDIR /api-mocker/server

CMD "npm" "start"
