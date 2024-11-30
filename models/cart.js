const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true, // User reference is required
		},
		product: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "product",
			},
		],
		
		totalprice: {
			type: String,
			default: 0, // Set a default value of 0 for total price
		},
	},
	{ timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
