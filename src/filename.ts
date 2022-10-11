export function filename(req: Request) {
	return `${req.key}.${req.hash}.${req.width}.${req.format}`
}
