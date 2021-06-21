const express = require("express");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

const sliderCaptcha = require("@slider-captcha/core");

app.use(cookieParser());

app.use(express.json());

app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: "namdepzai",
		cookie: { maxAge: 60000, httpOnly: true, sameSite: "None", secure: true }
	})
);

app.use(
	cors({
		credentials: true,
		origin: "http://localhost:3000"
	})
);

app.get("/captcha/create", function (req, res) {
	sliderCaptcha.create({ distort: true, rotate: true }).then(function ({ data, solution }) {
		req.session.captcha = solution;
		req.session.save();
		res.status(200).send(data);
	});
});

app.post("/captcha/verify", function (req, res) {
	sliderCaptcha.verify(req.session.captcha, req.body).then(function (verification) {
		if (verification.result === "success") {
			req.session.token = verification.token;
			req.session.save();
		}
		res.status(200).send(verification);
	});
});

app.listen(PORT, () => {
	console.log("server dang chay", PORT);
});
