const mongoose = require("mongoose");

const productScheme = mongoose.Schema(
	{
		name: {
			type: String,
		},
		image: {
			type: Buffer,
		},
		price: {
			type: String,
		},
		discount: {
			type: String,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("product", productScheme);

