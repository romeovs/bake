import { Request } from "./matrix"
import { SrcInfo } from "./manifest"

const base = 36
const separator = "."

type Def<T> = {
	name: keyof Request
	type: T
}

function string<K extends keyof Request>(name: Request[K] extends string ? K : never): Def<"string"> {
	return { name, type: "string" }
}

function number<K extends keyof Request>(name: Request[K] extends number ? K : never): Def<"number"> {
	return { name, type: "number" }
}

const order = [
	string("key"),
	string("hash"),
	number("width"),
	number("height"),
	number("quality"),
	string("format"),
] as const

export function filename(req: Request): string {
	return order
		.map(function (defn) {
			const { name, type } = defn
			const value = req[name]

			if (type === "number") {
				return value.toString(base)
			}

			return value
		})
		.join(separator)
}

export function parse(url: string): SrcInfo {
	const parts = url.split("/")
	const basename = parts[parts.length - 1]
	const items = basename.split(separator)

	const entries = order.map(function (defn, index) {
		const { name, type } = defn
		const value = items[index]

		if (type === "number") {
			return [name, parseInt(value, base)]
		}

		return [name, value]
	})

	return {
		url,
		...Object.fromEntries(entries),
	}
}
