.PHONY: all

apply:
	cd ./process/src && make build
	terraform get
	terraform apply

visualize:
	terraform graph | dot -Tpng > ./docs/graph.png
