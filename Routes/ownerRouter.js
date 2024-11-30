const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../config/multer");
const product = require("../models/productmodel");
const validate = require("../middelware/isLogin");

if (process.env.NODE_ENV === "DEVELOPMENT") {
	router.get("/create", async function (req, res) {
		const name = "AdminName";
		const email = "admin123@gmail.com";
		const password = "admin123"; // Use a strong password in a real scenario
		try {
			let salt = await bcrypt.genSalt(10);
			let hash = await bcrypt.hash(password, salt);
			let createOwner = await ownerModel.create({
				name,
				email,
				password: hash,
			});
			let token = jwt.sign(
				{ email: "admin123@gmail.com", admin: true },
				process.env.JWT
			);
			res.cookie("token", token);
			res.send("Admin created successfully");
		} catch (error) {
			console.error(error);
			res.status(500).send("Server error");
		}
	});
}

router.get("/login", function (req, res) {
	res.render("owner-login");
});
router.post("/login", async function (req, res) {
	let { email, password } = req.body;
	try {
		let owner = await ownerModel.findOne({ email: email });
		if (!owner) {
			res.owner("Owner not found");
		}
		let vaild = await bcrypt.compare(password, owner.password);
		if (vaild) {
			let token = jwt.sign(
				{ email: "admin123@gmail.com", admin: true },
				process.env.JWT
			);
			res.cookie("token", token);
			res.redirect("/owners/product");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

router.get("/product", validate, async function (req, res) {
	let Product = await product.find();
	res.render("product", { Product });
});

router.get("/createproduct", function (req, res) {
	res.render("createproducts");
});

router.post("/product", upload.single("image"), async function (req, res) {
	try {
		let { name, price, discount } = req.body;
		let Product = await product.create({
			name,
			price,
			discount,
			image: req.file.buffer,
		});

		res.redirect("/owners/product");
	} catch (error) {
		res.send(error.message);
	}
});

router.post("/edit/:id", upload.single("image"), async function (req, res) {
	try {
		let { name, discount, price } = req.body;
		let { id } = req.params;
		let image = req.file;
		let Product = await product.findByIdAndUpdate(
			id,
			{ name, discount, price },
			{ new: true }
		);
		if (!Product) {
			return res.status(404).send("Post is not aviable");
		}
		if (image) {
			Product.image = image.buffer;
		}
		await Product.save();
		res.redirect("/owners/product");
	} catch (error) {
		res.send(error.message);
	}
});
router.get("/logout", validate, function (req, res) {
	res.cookie("token", "");
	res.redirect("/owners/login");
});

module.exports = router;

