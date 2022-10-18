bin = node_modules/.bin

build:
	@node vite.js

run.bake:
	@env node dist/bake.js

run.check:
	@env node dist/bake.js check

check:
	@$(bin)/package-check

typecheck:
	@$(bin)/tsc --noEmit

formatting:
	@$(bin)/prettier --check .
