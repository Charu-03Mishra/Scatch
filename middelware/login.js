const login = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/users");
};

module.exports = login;
