bin = node_modules/.bin

dev:
	@env NODE_ENV=development node vite.js

build:
	@node vite.js

run.bake:
	@env node dist/bake.js

run.check:
	@env node dist/bake.js check

run.example:
	@$(bin)/esbuild --platform=node --bundle example/index.ts | node

check:
	@$(bin)/package-check

typecheck:
	@$(bin)/tsc --noEmit

formatting:
	@$(bin)/prettier --check .
