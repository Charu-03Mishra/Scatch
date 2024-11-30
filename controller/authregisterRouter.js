const usermodel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const initializingPassport = require("../middelware/passport");
const passport = require("passport");
initializingPassport(passport);
const { genrateToken } = require("../utils/jsonwebtoken");

module.exports.registerRouter = async function (req, res) {
	try {
		let { email, fullname, password } = req.body;

		// Check if the user already exists
		let user = await usermodel.findOne({ email: email });
		if (user) {
			req.flash("You have already registered an account, please login.");
		}

		// Generate salt and hash the password
		bcrypt.genSalt(10, async function (err, salt) {
			if (err) {
				return res.status(500).send(err.message);
			}
			bcrypt.hash(password, salt, async function (err, hash) {
				if (err) {
					return res.status(500).send(err.message);
				}

				// Create the user
				user = await usermodel.create({
					email,
					fullname,
					password: hash,
				});

				// Generate the token after user creation
				let token = genrateToken(user);

				// Set the token in a cookie
				res.cookie("token", token);
				res.status(201).redirect("/users");
			});
		});
	} catch (error) {
		console.error("Error during registration:", error);
		res.status(500).send(error.message);
	}
};

module.exports.logoutRouter = function (req, res, next) {
	req.logout(function (err) {
		if (err) return next(err);
		req.session.destroy((err) => {
			if (err) return next(err);
			res.clearCookie("connect.sid", { path: "/" }); // specify path and other options
			res.redirect("/home");
		});
	});
};

