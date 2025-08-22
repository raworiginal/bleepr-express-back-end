const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	text: {
		type: String,
		required: true,
		maxLength: 128,
	},
	author: {
		type: mongoose.Schema.Type.ObjectId,
		ref: "User",
	},
});

const bleepSchema = mongoose.Schema({
	text: {
		type: String,
		required: true,
		maxLength: 128,
	},
	author: {
		type: mongoose.Schema.Type.ObjectId,
		ref: "User",
	},
	favoritedBy: [
		{
			type: mongoose.Schema.Type.ObjectId,
			ref: "User",
		},
	],
	comments: [commentSchema],
	hashTags: [
		{
			type: String,
			maxLength: 128,
		},
	],
});

const Bleep = mongoose.model("Bleep", bleepSchema);

module.export = Bleep;
