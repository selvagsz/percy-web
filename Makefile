_pull_parent_image:
	gcloud auth configure-docker --quiet
	docker pull $$(grep '^FROM' Dockerfile | grep -o ' .*' | tr -d ' ')

build: _pull_parent_image
	docker-compose build

build-test: _pull_parent_image
	docker-compose build --build-arg testing="true" web

test: _pull_parent_image
	docker-compose run web yarn test:parallel | tee build.log | fgrep --invert-match '35mpercy'

publish:
	@utils/publish
