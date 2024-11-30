const express = require("express");
const router = express.Router();
let login = require("../middelware/login");
const Product = require("../models/productmodel");
const User = require("../models/usermodel");
const Cart = require("../models/cart");

router.get("/shop", login, async (req, res) => {
	let product = await Product.find();
	res.render("shop", { product });
});

router.get("/cart", login, async (req, res) => {
	let cart = await Cart.findOne({ user: req.session.passport.user }).populate(
		"product"
	);
	let cartDataStructure = {};

	cart.product.forEach((product) => {
		let key = product._id.toString();

		if (cartDataStructure[key]) {
			cartDataStructure[key].quantity += 1;
		} else {
			cartDataStructure[key] = {
				...product._doc,
				quantity: 1,
			};
		}
	});
	let finalarray = Object.values(cartDataStructure);
	let finalPrice;

	// If items are in the cart, calculate the total price + 30
	finalPrice = cart.totalprice;

	let totalprice = cart.totalprice;

	res.render("cart", {
		cart: finalarray,
		finalPrice: finalPrice,
		totalprice,
	});
});

// Add to cart route
router.get("/addtocart/:id", login, async function (req, res) {
	try {
		let cart = await Cart.findOne({ user: req.session.passport.user });
		let product = await Product.findOne({ _id: req.params.id });

		if (!cart) {
			cart = await Cart.create({
				user: req.user,
				product: [req.params.id],
				totalprice: Number(product.price),
			});
		} else {
			cart.product.push(req.params.id);
			cart.totalprice = Number(cart.totalprice) + Number(product.price);

			await cart.save();
		}
		res.redirect("/cart");
	} catch (error) {
		res.send(error.message);
	}
});

router.get("/remove/:id", login, async function (req, res) {
	try {
		let cart = await Cart.findOne({ user: req.user });
		let product = await Product.findOne({ _id: req.params.id });
		if (!cart) return res.send("something is wrong");
		let index = cart.product.indexOf(req.params.id);

		if (index !== -1) {
			cart.product.splice(index, 1);
			cart.totalprice = Number(cart.totalprice) - Number(product.price);
			await cart.save();
		} else {
			res.send("item is not in the cart");
		}
		await cart.save();
		res.redirect("/cart");
	} catch (error) {
		res.send(error.message);
	}
});

module.exports = router;

