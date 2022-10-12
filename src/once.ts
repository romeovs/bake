export function once<T>(fn: () => Promise<T>): () => Promise<T> {
	let promise: Promise<T> | null = null

	return function () {
		if (!promise) {
			promise = fn()
		}

		return promise
	}
}
