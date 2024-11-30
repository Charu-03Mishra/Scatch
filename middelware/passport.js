const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");

const initializingPassport = (passport) => {
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			async (email, password, done) => {
				try {
					const user = await User.findOne({ email });
					if (!user) {
						return done(null, false, { message: "Incorrect username." });
					}

					// Use bcrypt to compare passwords if they are hashed
					const isMatch = await bcrypt.compare(password, user.password);
					if (!isMatch) {
						return done(null, false, { message: "incorrect password." });
					}

					return done(null, user, { message: "Authentication successful." });
				} catch (err) {
					return done(err);
				}
			}
		)
	);
};

// Assuming `User` is your Mongoose model
passport.serializeUser((user, done) => {
	done(null, user.id); // or another unique identifier
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

module.exports = initializingPassport;
