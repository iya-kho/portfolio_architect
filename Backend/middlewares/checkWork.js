module.exports = (req, res, next) => {
	try{
		const host = req.get('host');
		const title = req.body.title.trim() ?? undefined;
		const categoryName = req.body.category ?? undefined;
		const userId = req.auth.userId ?? undefined;
		const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}` ?? undefined;

		if (title !== undefined &&
			title.length > 0 &&
			categoryName !== undefined &&
			userId !== undefined &&
			imageUrl !== undefined){
			next()
		}else{
			return res.status(400).json({error: new Error("Bad Request")})
		}
	}catch(e){
		return res.status(500).json({error: new Error("Something wrong occured")})
	}

}
