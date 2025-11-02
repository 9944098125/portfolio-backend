import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
	{
		full_name: {
			type: String,
		},
		image: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
		},
		countryCode: {
			type: String,
		},
		phone: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		about: {
			type: String,
		},
		city: {
			type: String,
		},
		designation: {
			type: String,
		},
		is_admin: {
			type: Boolean,
		},
		projects: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Projects",
			},
		],
		skills: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Skills",
			},
		],
		contacts: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Contacts",
			},
		],
		educationalDetails: {
			type: mongoose.Types.ObjectId,
			ref: "EducationalDetails",
		},
	},
	{ timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
