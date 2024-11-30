const mongoose = require("mongoose");

require("dotenv").config();
mongoose
	.connect(process.env.MONGOOSECONNECTION)
	.then(function () {
		console.log("connected");
	})
	.catch(function (err) {
		console.log(err.message);
	});

const db = mongoose.connection;

module.exports = db;
