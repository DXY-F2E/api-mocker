SHELL := /bin/bash

.PHONY: dsl-core prerequ-program client server

DSL_SRC = $(wildcard dsl-core/src/*.js)
DSL_LIBS = $(DSL_SRC:dsl-core/src/%=dsl-core/lib/%)

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

$(DSL_LIBS): $(DSL_SRC)
	cd dsl-core  && npm install && npm run build

dsl-core: $(DSL_LIBS)

server:|dsl-core
	cd server && npm install && npm run dev

client:|dsl-core
	cd client && npm install && npm run dev

install:|prerequ-program
