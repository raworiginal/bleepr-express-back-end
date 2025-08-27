const express = require("express");
const verifyToken = require("../middleware/verify-token");
const Bleep = require("../models/bleep.js");
const Bleepr = require("../models/bleepr.js");
const router = express.Router();

// ========================= CREATE =========================== //

// POST /bleeps
router.post("/", verifyToken, async (req, res) => {
	try {
		req.body.author = req.bleepr._id;
		const bleep = await Bleep.create(req.body);
		bleep._doc.author = req.bleepr;
		res.status(201).json(bleep);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// POST /bleeps/:bleepId/comments
router.post("/:bleepId/comments", verifyToken, async (req, res) => {
	//add route
	try {
		req.body.author = req.bleepr._id;
		const bleep = await Bleep.findById(req.params.bleepId);
		bleep.comments.push(req.body);
		await bleep.save();
		const newComment = bleep.comments[bleep.comments.length - 1];
		newComment._doc.author = req.bleepr;
		res.status(201).json(newComment);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// POST /bleeps/:bleepId/liked-by
router.post("/:bleepId/favorite", verifyToken, async (req, res) => {
	try {
		const bleep = await Bleep.findById(req.params.bleepId);

		if (!bleep) {
			return res.status(404).send("bleep not found");
		}

		if (!bleep.favoritedBy.includes(req.bleepr._id)) {
			bleep.favoritedBy.push(req.bleepr._id);
			await bleep.save();
			await Bleepr.findByIdAndUpdate(req.bleepr._id, {
				$push: { favoritedBleeps: bleep._id },
			});
		} else {
			bleep.favoritedBy.pull(req.bleepr._id);
			await bleep.save();
			await Bleepr.findByIdAndUpdate(req.bleepr._id, {
				$pull: { favoritedBleeps: bleep._id },
			});
		}
		res.status(200).json(bleep.favoritedBy);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// =========================== READ ============================ //

//GET /bleeps
router.get("/", verifyToken, async (req, res) => {
	try {
		const bleeps = await Bleep.find({})
			.populate("author")
			.populate("comments.author")
			.sort({ createdAt: "desc" });
		res.status(200).json(bleeps);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET /bleeps/:bleepId
router.get("/:bleepId", verifyToken, async (req, res) => {
	try {
		const bleep = await Bleep.findById(req.params.bleepId)
			.populate("author")
			.populate("comments.author");
		res.status(200).json(bleep);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//============================UPDATE =========================== //

// PUT /bleeps/:bleepId
router.put("/:bleepId", verifyToken, async (req, res) => {
	try {
		const bleep = await Bleep.findById(req.params.bleepId);

		if (!bleep.author.equals(req.bleepr._id)) {
			return res.status(403).send("You're not allowed to do that!");
		}

		const updatedBleep = await Bleep.findByIdAndUpdate(
			req.params.bleepId,
			req.body,
			{ new: true }
		);
		updatedBleep._doc.author = req.bleepr;

		res.status(200).json(updatedBleep);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// PUT /:bleepId/comments/:commentId
router.put("/:bleepId/comments/:commentId", verifyToken, async (req, res) => {
	try {
		const bleep = await Bleep.findById(req.params.bleepId);
		const comment = bleep.comments.id(req.params.commentId);

		if (comment.author.toString() !== req.bleepr._id) {
			return res
				.status(403)
				.json({ message: "You are not authorized to edit this comment" });
		}
		comment.text = req.body.text;
		await bleep.save();
		res.status(200).json({ message: "Comment updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// ========================== DELETE =========================== //

//Delete /bleeps/:bleepId
router.delete("/:bleepId", verifyToken, async (req, res) => {
	try {
		const bleep = await Bleep.findById(req.params.bleepId);

		if (!bleep.author.equals(req.bleepr._id)) {
			return res.status(403).send("You're not allowed to do that!");
		}
		const deletedBleep = await Bleep.findByIdAndDelete(req.params.bleepId);
		res.status(200).json(deletedBleep);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE /bleeps/:bleepId/comments/:commentId
router.delete(
	"/:bleepId/comments/:commentId",
	verifyToken,
	async (req, res) => {
		try {
			const bleep = await Bleep.findById(req.params.bleepId);
			const comment = bleep.comments.id(req.params.commentId);

			if (comment.author.toString() !== req.bleepr._id) {
				return res
					.status(403)
					.json({ message: "You are not authorized to edit this comment" });
			}

			bleep.comments.remove({ _id: req.params.commentId });
			await bleep.save();
			res.status(200).json({ message: "Comment deleted successfully" });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
);
module.exports = router;
