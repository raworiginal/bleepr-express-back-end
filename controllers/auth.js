const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Bleepr = require("../models/bleepr");
const saltRounds = 12;
router.post("/sign-up", async (req, res) => {
	try {
		// Check if the username is already taken
		const bleeprInDatabase = await Bleepr.findOne({
			username: req.body.username,
		});

		if (bleeprInDatabase) {
			return res.status(409).json({ err: "username already taken." });
		}

		// Create a new user with hashed password
		const bleepr = await Bleepr.create({
			username: req.body.username,
			hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
			email: req.body.email,
		});

		const payload = { username: bleepr.username, _id: bleepr._id };

		const token = jwt.sign({ payload }, process.env.JWT_SECRET);

		res.status(201).json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/sign-in", async (req, res) => {
	try {
		const bleepr = await Bleepr.findOne({ username: req.body.username });
		if (!bleepr) {
			return res.status(401).json({ err: "Invalid credentials." });
		}

		const isPasswordCorrect = bcrypt.compareSync(
			req.body.password,
			user.hashedPassword
		);

		if (!isPasswordCorrect) {
			return res.status(401).json({ err: "Invalid credentials." });
		}

		const payload = { username: bleepr.username, _id: bleepr._id };
		const token = jwt.sign({ payload }, process.env.JWT_SECRET);

		res.status(200).json({ token });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
});

module.exports = router;
