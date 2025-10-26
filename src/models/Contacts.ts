import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema(
	{
		medium: {
			type: String,
		},
		logo: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Contacts = mongoose.model("Contacts", contactsSchema);

export default Contacts;
