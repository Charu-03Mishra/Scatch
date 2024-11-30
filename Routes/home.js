const express = require("express");
const router = express.Router();
const product = require("../models/productmodel");

router.get("/", async function (req, res) {
	const rnproduct = await product.aggregate([{ $sample: { size: 4 } }]);

	res.render("home", { user: req.user || null, rnproduct });
});

module.exports = router;
