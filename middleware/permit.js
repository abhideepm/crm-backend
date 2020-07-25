const permit = (...allowed) => {
	const isAllowed = role => allowed.indexOf(role) > -1

	return (req, res, next) => {
		if (req.body && isAllowed(req.body.role)) next()
		else res.status(403).json({ message: 'Forbidden' })
	}
}

module.exports = permit
