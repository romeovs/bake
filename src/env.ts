import process from "process"

export function env(name: string): string
export function env(name: string, fallback: string): string
export function env(name: string, fallback: string | null): string | null
export function env(name: string, fallback?: string | null): string | null {
	const value = process.env[name]
	if (value) {
		return value
	}

	if (fallback === null) {
		return null
	}

	if (fallback !== undefined) {
		return fallback
	}

	throw new Error(`${name} is not set`)
}
