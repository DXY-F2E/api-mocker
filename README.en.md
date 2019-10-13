# API Management Surface - API Mocker

> API Mocker does not only mock the API, it aims to improve front-end and back end cooperative development by providing a unified API management, and a platform to communicate iterative improvments and maintainence of the API.

Click to view live example ==> [DEMO](http://api-mocker.com/)

**Note: The provided demo demonstrates the look and feel of the project but does not gurantee data security and stability, and may even delete data periodically. Do not use the demo for personal or business projects**

***

## Contents
- [System Functionality](#system-functionality)
- [Technology stack and third party libraries](#technology-stack-and-third-party-libraries)
- [Getting Started](#getting-started)
- [Deployment Notes](#deployment-notes)

## System Functionality

### API Conventions

API Mocker provides a user friendly yet powerful API editior, users can easily define various API behaviors such as:

- Structured parameter input and output
  - Support different request parameter types (`query`，`body`，`path`, `header`)
  - Strict parameter checking
  - Support for data types(`string`，`number`，`boolean`，`object`，`array`)
  - 参数备注、示例
- support `JSON` parsing
- maintains history data

![demo screenshot](https://user-gold-cdn.xitu.io/2017/9/15/e4728e628394957924f586517e8d8b1b)

### Mock data

API Mocker believes that the defined mock api should not only be enforced on the response but also in the request conventions. Thus, we provide a production quality mock service

- Mock requests generates fake data based on defined rules
- Mock api will check the reqest parameters from rules (Check for optionals or correct parameter types)
- Able to mock various real-life responses such as `200`, `404`, `500` based on user settings
- Support proxy requests from live or testing evironments, for separation of development environments excluding charles proxy
- supports [Mock.js](http://mockjs.com/) grammar and conventions

### API documentation

API Mocker automatically generates concise, well-structured interface documents based on defined rules. You can also subscribe to API changes individually or in subscription groups, to receive an email when any interface in the subscription list have been added, modified or deleted.

![screenshot of api documentation](https://user-gold-cdn.xitu.io/2017/9/15/bf8a8ab4587aae27ea45047b05de8df7)

### API Authorisation

API Mocker provides convinient access control

- group level api control
- retrieve and write control

### Other capabilities

- API testing: developers can conviniently test the API instead of repeatedly filling up fields with request tools like `postman`
- Convinient API search (search by url, administrators, etc.)
- support import from  `RAP`

***

## Technology stack and third party libraries

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

## Getting Started

Installation requires certain external commands(`mongod`)

* `make install`

This command will also ensure the startup process of `mongod`. If it is not started, it will create the `db` directory locally and start `mongod`.
If the server is booted up, re-execute `make install` to ensure the database is started.

## Server Configuration

To start the project for the first time, you need to manually add the configuration files `./server/config/core.js` and `./server/config/manager.js`

You can quick start by duplicating `./server/config/default.core.js` and `./server/config/default.manager.js` respectively

Note: core.js contains the configurations for mongo database, md5 key, mail service;
manager.js is for initializing new super administrator account.

## Deployment (dev)

### Client

* `make client` or  `cd client && npm install && npm run dev`

### Server

* `make server` or `cd server && npm install && npm run dev`

## Deployment (prods)

### Client

* `make prod_client` or `cd client && npm install && npm run build`

### Server

* `make prod_server` or `cd server && npm install && npm start`

Default port number is `7001`

***


## Deployment Notes

### Environment requirements
```json
"node": ">= 6.0.0",
"npm": ">= 3.0.0"
```
### Config - Server

If you require `https` support, the certificate paths is sent in `server/index.js`. Other server configurations are in the `server/config` such as:

`clientRoot`: client address, currently only used in sending reminder emails;

`transporter`: For mail-related configuration, please set your own push mailbox. Some mail service providers have a high security policy and push errors occur. Please test them yourself. If not configured, the system does not push the email;

`pushInterval`: The mail push interval timings. Currently only this configuration is modified for the api;

`mongoose`: related configuration of mongoDB;

`bodyParser.jsonLimit`: The maximum limit for api request information. Because the amount of data is relatively large when the api is updated, you have to define the limit.

For other configurations, please see the file comments and [related content](https://eggjs.org/en-us/basics/config.html#container). in the egg.js documentation 

### Config - Client

The client is configured in `client/config/index.js`. among them:

`docsUrl`: The document address, which can be configured to its own git repository;

`serverRoot`: server interface root path;

`assetsPublicPath`: Static file public path, all static file resource addresses, starting with this path. Please configure according to your own release requirements.

For other related configurations, please refer to the vue-cli scaffolding [webpack template] (https://github.com/vuejs-templates/webpack)

### **Example Deployment with nginx**

Suppose the api-mocker project folder path is `__api_mocker_path`

With the domain name `your-mocker.com`

1. Deploy (prods), please refer to the [above commands](#deployment-\(prods\))
2. nginx add configuration:
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
2. modify the config of `serverRoot` under `client/config/index.js` to `your-mocker.com/mock-api`
3. visit `http://your-mocker.com/mock`

> Note: If the server bandwidth is low, you can deploy the client to cdn, configure the route, and re-update the `index.html` file cache under the dist directory, Or just synchronize the `client/dist/static` directory to cdn, and then do the forwarding configuration for your own nginx.
