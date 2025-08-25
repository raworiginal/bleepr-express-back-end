// controllers/bleeprs.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const Bleepr = require("../models/bleepr");

/* ==================== CREATE ==================== */
// Create About me in User

/* ==================== READ ==================== */
// index all users
router.get("/", verifyToken, async (req, res) => {
	try {
		// Get a list of all bleeprs, but only return their username and _id
		const bleeprs = await Bleepr.find({});
		res.json(bleeprs);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// get specific user
router.get("/:bleeprId", verifyToken, async (req, res) => {
	try {
		if (req.bleepr._id !== req.params.bleeprId) {
			return res.status(403).json({ error: "Unauthorized" });
		}

		const bleepr = await Bleepr.findById(req.params.bleeprId);

		if (!bleepr) {
			return res.status(404).json({ error: "Bleepr not found." });
		}

		res.json({ bleepr });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// View all Friends
// View Top 8
/* ==================== UPDATE ==================== */
//Add a Friend
// Remove a Friend
//Add to top8
// remove from top 8

// update about me
router.put("/:bleeprId/aboutMe", verifyToken, async (req, res) => {
	// const bleepr = await Bleepr.findById(req.params.bleeprId);
	try {
		if (req.bleepr._id !== req.params.bleeprId) {
			return res.status(403).json({ error: "Unauthorized" });
		}
		await Bleepr.findByIdAndUpdate(req.params.bleeprId, {
			aboutMe: req.body,
		});
		res.status(200).json("Update success");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
/* ==================== DELETE ==================== */
module.exports = router;
