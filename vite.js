const path = require("path")
const vite = require("vite")
const dts = require("vite-plugin-dts")
const hashbang = require("rollup-plugin-add-shebang")

const production = process.env.NODE_ENV !== "development"

async function main() {
	await vite.build({
		mode: "production",
		plugins: [
			production &&
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
				entry: "./src/index.ts",
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
		build: {
			outDir: "dist",
			emptyOutDir: false,
			target: "esnext",
			sourcemap: true,
			minify: false,
			lib: {
				entry: "./src/client.tsx",
				formats: ["es", "cjs"],
				fileName(format) {
					if (format === "es") {
						return "client.mjs"
					} else {
						return "client.cjs"
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
