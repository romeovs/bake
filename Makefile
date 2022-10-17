bin = node_modules/.bin

build:
	@node vite.js

run.bake:
	@env node dist/cmd.js

run.check:
	@env node dist/cmd.js check

check:
	@package-check

typecheck:
	@$(bin)/tsc --noEmit

formatting:
	@$(bin)/prettier --check .
