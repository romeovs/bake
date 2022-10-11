build:
	@esbuild --platform=node --target=node16 --format=cjs --bundle --outfile=dist/index.js --external:sharp src/index.ts

bake:
	@env node dist/index.js

check:
	@env node dist/index.js check
