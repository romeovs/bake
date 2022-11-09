import { promises as fs } from "fs"

export async function exists(filename: string): Promise<boolean> {
	try {
		const f = await fs.stat(filename)
		return f.size > 0
	} catch (err) {
		return false
	}
}
