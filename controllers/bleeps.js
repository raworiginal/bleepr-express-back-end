const express = require("express");
const verifyToken = require("../middleware/verify-token");
const Bleep = require("../models/bleep.js");
const router = express.Router();

// CREATE

// POST /bleeps
router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.author = req.bleepr._id
        const bleep = await Bleep.create(req.body);
        bleep._doc.author = req.bleepr;
        res.status(201).json(bleep);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// READ

// UPDATE

// DELETE


module.exports = router;