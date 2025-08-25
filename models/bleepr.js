const mongoose = require("mongoose");

// a bleepr is a user
const aboutMeSchema = mongoose.Schema({
	name: {
		type: String,
	},
	age: {
		type: Number,
	},
	gender: {
		type: String,
	},
	location: {
		type: String,
	},
	bio: {
		type: String,
	},
	openTo: {
		type: [String],
		Enum: ["networking", "dating", "making friends", "mentoring"],
	},

	notOpenTo: {
		type: [String],
		Enum: ["networking", "dating", "making friends", "mentoring"],
	},
	relationshipStatus: {
		type: String,
		Enum: [
			"single",
			"in a relationahip",
			"married",
			"it's complicated",
			"open",
		],
	},
});
const bleeprSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	hashedPassword: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bleepr",
		},
	],
	top8: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bleepr",
		},
	],
	favoritedBleeps: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bleep",
		},
	],
	isOnline: {
		type: Boolean,
	},
	offlineMsg: {
		type: String,
	},
	aboutMe: {
		type: aboutMeSchema,
	},
});

bleeprSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		delete returnedObject.hashedPassword;
	},
});
const Bleepr = mongoose.model("Bleepr", bleeprSchema);

module.exports = Bleepr;
