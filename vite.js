const path = require("path")
const vite = require("vite")
const dts = require("vite-plugin-dts")
const hashbang = require("rollup-plugin-add-shebang")

async function main() {
	await vite.build({
		mode: "production",
		plugins: [
			dts({
				insertTypeEntry: true,
				rollupTypes: true,
				copyDtsFiles: false,
			}),
		],
		build: {
			outDir: "dist",
			emptyOutDir: true,
			target: "esnext",
			sourcemap: true,
			minify: false,
			lib: {
				entry: "./src/index.tsx",
				formats: ["es", "cjs"],
				fileName(format) {
					if (format === "es") {
						return "index.mjs"
					} else {
						return "index.cjs"
					}
				},
			},
			rollupOptions: {
				external,
			},
		},
	})

	await vite.build({
		mode: "production",
		plugins: [
			hashbang({
				include: ["dist/bake.js"],
			}),
		],
		build: {
			outDir: "dist",
			emptyOutDir: false,
			target: "es2015",
			sourcemap: true,
			minify: false,
			lib: {
				entry: "./src/cmd.ts",
				formats: ["cjs"],
				fileName: "bake",
			},
			rollupOptions: {
				external,
			},
		},
	})
}

main()

function external(id, importer) {
	if (!importer) {
		// this is the entry
		return false
	}

	if (!id.startsWith(".") && !path.isAbsolute(id)) {
		// this is most a package name
		return true
	}

	return false
}
