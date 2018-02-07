FROM mongo:latest

CMD mkdir -f /data/db

EXPOSE 27017

CMD "mongod"
