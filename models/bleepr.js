const mongoose = require("mongoose");

// a bleepr is a user
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

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		delete returnedObject.hashedPassword;
	},
});
const Bleepr = mongoose.model("Bleepr", userSchema);

module.exports = Bleepr;
