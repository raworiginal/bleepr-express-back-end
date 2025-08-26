const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			maxLength: 128,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bleepr",
		},
	},
	{ timestamps: true }
);

const bleepSchema = mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			maxLength: 128,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bleepr",
		},
		favoritedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Bleepr",
			},
		],
		comments: [commentSchema],
		hashTags: [
			{
				type: String,
				maxLength: 128,
			},
		],
	},
	{ timestamps: true }
);

const Bleep = mongoose.model("Bleep", bleepSchema);

module.exports = Bleep;
