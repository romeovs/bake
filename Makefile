build:
	@esbuild --platform=node --target=node16 --format=cjs --bundle --outfile=dist/cmd.js --external:sharp src/cmd.ts
	@esbuild --platform=node --target=node16 --format=cjs --bundle --outfile=dist/index.js --external:sharp --external:react --jsx=automatic src/index.tsx
	@esbuild --platform=node --target=node16 --format=esm --bundle --outfile=dist/index.es.js --external:sharp --external:react --jsx=automatic src/index.tsx

run.bake:
	@env node dist/cmd.js

run.check:
	@env node dist/cmd.js check

check:
	@package-check

typecheck:
	@tsc --noEmit
