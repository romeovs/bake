export type Format = "jpeg" | "webp" | "avif"

export function isFormat(format: string): format is Format {
	return format === "jpeg" || format === "webp" || format === "avif"
}
