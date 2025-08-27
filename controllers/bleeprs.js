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
		const bleeprs = await Bleepr.find({}).populate("friends");
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

/* ==================== UPDATE ==================== */

router.put("/:bleeprId/top8/:friendId/add", verifyToken, async (req, res) => {
	try {
		const currentBleepr = await Bleepr.findById(req.params.bleeprId);
		if (req.bleepr._id !== req.params.bleeprId) {
			return res.status(403).json({ error: "Unauthorized" });
		}
		if (currentBleepr.top8.includes(req.params.friendId)) {
			return res.status(409).json("Already in Top 8");
		}
		if (currentBleepr.top8.length >= 8) {
			return res.status(409).json("Top 8 is full.");
		}
		currentBleepr.top8.push(req.params.friendId);
		await currentBleepr.save();
		res.status(200).json(currentBleepr.top8);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// remove from top 8
router.put(
	"/:bleeprId/top8/:friendId/remove",
	verifyToken,
	async (req, res) => {
		try {
			const currentBleepr = await Bleepr.findById(req.params.bleeprId);

			if (req.bleepr._id !== req.params.bleeprId) {
				return res.status(403).json({ error: "Unauthorized" });
			}

			currentBleepr.top8.pull(req.params.friendId);
			await currentBleepr.save();
			res.status(200).json(currentBleepr.top8);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
);

// update aboutMe
router.put("/:bleeprId/aboutMe", verifyToken, async (req, res) => {
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

// Add  or remove a friend
router.put("/:bleeprId/friend", verifyToken, async (req, res) => {
	try {
		const currentBleepr = await Bleepr.findById(req.bleepr._id);
		if (!currentBleepr) return res.status(404).send("bleepr not found");
		const friendedBleepr = await Bleepr.findById(req.params.bleeprId);
		if (!friendedBleepr) return res.status(404).send("bleepr not found");
		if (!currentBleepr.friends.includes(friendedBleepr._id)) {
			currentBleepr.friends.push(friendedBleepr._id);
			await currentBleepr.save();
			friendedBleepr.friends.push(currentBleepr._id);
			await friendedBleepr.save();
		} else {
			currentBleepr.friends.pull(friendedBleepr._id);
			await currentBleepr.save();
			friendedBleepr.friends.pull(currentBleepr._id);
			await friendedBleepr.save();
		}
		res.status(200).json({ currentBleepr, friendedBleepr });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/* ==================== DELETE ==================== */

module.exports = router;
