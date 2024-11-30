const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userScheme = new mongoose.Schema(
	{
		fullname: {
			type: String,
		},
		email: {
			type: String,
		},
		password: {
			type: String,
		},

		order: {
			type: Array,
			default: [],
		},
		contact: {
			type: Number,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

userScheme.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userScheme);

