import path from "path"
import { ROOT } from "./config"
import { hash } from "./hash"

export function encode(filename: string): string {
	const rel = path.relative(ROOT, path.resolve(filename))
	return hash(rel)
}
