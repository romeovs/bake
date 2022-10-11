import process from "process"

export function env(name: string, fallback?: string): string {
	const value = process.env[name]
	if (value) {
		return value
	}

	if (fallback !== undefined) {
		return fallback
	}

	throw new Error(`${name} is not set`)
}
