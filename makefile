SHELL := /bin/bash

.PHONY: dsl-core prerequ-program client server prod_server prod_client

DSL_SRC = $(wildcard dsl-core/src/*.js)
DSL_LIBS = $(DSL_SRC:dsl-core/src/%=dsl-core/lib/%)

install:|prerequ-program


define require_install
	if test "$(shell which $(1))" = ""; \
	then \
		brew install $(2) \
	else \
		echo $(1) is exists. skip install; \
	fi
endef

prerequ-program:
	@$(call require_install,mongod,mongo)
	mkdir -p ./db/
	if [ "${shell pgrep mongod}" = "" ]; then mongod --bind_ip 127.0.0.1 --fork --dbpath ./db/ --logpath ./db/mongod.log; fi
	@echo "start mongod success!"

$(DSL_LIBS): $(DSL_SRC)
	cd dsl-core  && npm install && npm run build

dsl-core: $(DSL_LIBS)

# 开发模式
server:|dsl-core
	cd server && npm install && npm run dev


prod_server:|dsl-core
	cd server && npm install && npm start
prod_client:|dsl-core
	cd client && npm install && npm run build
	if [ ! -d dist ]; then \
		mkdir dist; \
	else \
		rm -rf ./dist/*; \
	fi
	cp -rf client/dist/* ./dist/
# 开发模式
client:|dsl-core
	cd client && npm install && npm run dev
