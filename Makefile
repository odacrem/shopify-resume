.phoney: *

update_secrets:
	flyctl secrets import < .env.production

deploy:
	fly deploy

ssh:
	fly ssh console
