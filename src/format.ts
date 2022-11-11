export type Format = "jpeg" | "webp" | "avif" | "png" | "gif"

export function isFormat(format: string): format is Format {
	return format === "jpeg" || format === "webp" || format === "avif" || format === "png" || format === "gif"
}
