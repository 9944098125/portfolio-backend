import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema(
	{
		medium: {
			type: String,
		},
		logo: {
			type: String,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
		},
	},
	{ timestamps: true }
);

const Contacts = mongoose.model("Contacts", contactsSchema);

export default Contacts;
