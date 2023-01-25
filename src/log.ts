export class Logger {
	log(message: string) {
		console.log(message)
	}

	error(message: string) {
		console.error(message)
	}

	progress(total: number): Progress {
		return new Progress(total)
	}
}

export class Progress {
	total: number
	current: number

	constructor(total: number) {
		this.total = total
		this.current = 0
	}

	step(message: string) {
		this.current += 1

		const percentage = Math.round((100 * this.current) / this.total)
		const size = Math.log10(this.total) + 1

		console.log(
			[
				`${percentage.toString().padStart(3, " ")}%`,
				`${this.current.toString().padStart(size, " ")}/${this.total}`,
				message,
			].join("  "),
		)
	}
}

export const log = new Logger()
