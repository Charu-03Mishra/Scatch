const express = require("express");
const app = express();
require("dotenv").config();
const passport = require("passport")
const cookie = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const user = require("./models/usermodel")
const homeRouter = require("./Routes/home");
const indexRouter = require("./Routes/indexRouter");
const ownerRouter = require("./Routes/ownerRouter");
const userRouter = require("./Routes/userRouter");

require("./config/db-connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookie());
app.use(
	expressSession({
		resave: false,
		saveUninitialized: false,
		secret: process.env.SECRET_KEY,
	})
);
app.use(passport.initialize());
app.use(passport.session());


app.use("/home", homeRouter);
app.use("/", indexRouter);
app.use("/owners",ownerRouter);
app.use("/users", userRouter);

app.listen(3000);

