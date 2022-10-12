build:
	@esbuild --platform=node --target=node16 --format=cjs --bundle --outfile=dist/cmd.js --external:sharp src/cmd.ts
	@esbuild --platform=node --target=node16 --format=cjs --bundle --outfile=dist/index.js --external:sharp --external:react --jsx=automatic src/index.tsx

bake:
	@env node dist/cmd.js

check:
	@env node dist/cmd.js check
