const jwt = require("jsonwebtoken");

async function validate(req, res, next) {
	try {
		let token = req.cookies.token;
		if (!token) return res.redirect("/owners/login");
		let data = await jwt.verify(token, process.env.JWT);
		req.user = data;
		next();
	} catch (error) {
		res.send("something wrong");
	}
}

module.exports = validate ;

