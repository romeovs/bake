build:
	@esbuild --platform=node --target=node16 --format=cjs --bundle --outfile=dist/index.js src/index.ts

serve:
	@node dist/index.js serve

bake:
	@node dist/index.js bake
