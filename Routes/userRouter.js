const express = require("express");
const router = express.Router();
const passport = require("passport");
const initializingPassport = require("../middelware/passport");
initializingPassport(passport);
const {
	registerRouter,
	logoutRouter,
} = require("../controller/authregisterRouter");

router.get("/", (req, res) => {
	res.render("user");
});
router.post("/register", registerRouter);
router.post(
	"/login", // Corrected the route name from '/loged'
	passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/users", // Optional: Redirect on failure
	}),
	function (req, res) {}
);
router.get("/logout", logoutRouter);

module.exports = router;

