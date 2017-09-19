SHELL := /bin/bash

.PHONY: prerequ-program client server prod_server prod_client


install:|prerequ-program

define require_install
	if test "$(shell which $(1))" = ""; \
	then \
		brew install $(2); \
	else \
		echo $(1) is exists. skip install; \
	fi
endef

prerequ-program:
	@$(call require_install,mongod,mongo)
	mkdir -p ./db/
	if [ "${shell pgrep mongod}" = "" ]; then mongod --bind_ip 127.0.0.1 --fork --dbpath ./db/ --logpath ./db/mongod.log; fi
	@echo "start mongod success!"

# 开发模式
server:
	cd server && npm install && npm run dev

client:
	cd client && npm install && npm run dev

# 生产模式
prod_server:
	cd server && npm install && npm start

prod_client:
	cd client && npm install && npm run build
