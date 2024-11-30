const mongoose = require("mongoose");

const ownerScheme = mongoose.Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
		},
		password: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("owner", ownerScheme);

