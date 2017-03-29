SHELL := /bin/bash

.PHONY: dsl-core prerequ-program client server

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

dsl-core:
	cd dsl-core  && npm install && npm run build

server:|prerequ-program dsl-core
	cd server && npm install && npm run dev

client:|dsl-core
	cd client && npm install && npm run dev




