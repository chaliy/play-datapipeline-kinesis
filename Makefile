.PHONY: all

apply:
	cd ./process/src && make build
	terraform get
	terraform apply