// controllers/bleeprs.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const Bleepr = require("../models/bleepr");

router.get("/", verifyToken, async (req, res) => {
	try {
		// Get a list of all bleeprs, but only return their username and _id
		const bleeprs = await Bleepr.find({}, "username");

		res.json(bleeprs);
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
});
router.get("/:bleeprId", verifyToken, async (req, res) => {
	try {
		if (req.bleepr._id !== req.params.bleeprId) {
			return res.status(403).json({ err: "Unauthorized" });
		}

		const bleepr = await Bleepr.findById(req.params.bleeprId);

		if (!bleepr) {
			return res.status(404).json({ err: "Bleepr not found." });
		}

		res.json({ bleepr });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
});
module.exports = router;
