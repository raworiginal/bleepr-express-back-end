const express = require("express");
const verifyToken = require("../middleware/verify-token");
const Bleep = require("../models/bleep.js");
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

// =========================== READ ============================ //

//GET /bleeps
router.get("/", verifyToken, async (req, res) => {
    try {
        const bleeps = await Bleep.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(bleeps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /bleeps/:bleepId
router.get("/:bleepId", verifyToken, async (req, res) => {
    try {
        const bleep = await Bleep.findById(req.params.bleepId).populate("author");
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

        updatedBleep._doc.author = req.bleep;

        res.status(200).json(updatedBleep);
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
            return res.status(403).send("You're not allowed to do that!")
        }
        const deletedBleep = await Bleep.findByIdAndDelete(req.params.bleepId)
        res.status(200).json(deletedBleep)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})




module.exports = router;
