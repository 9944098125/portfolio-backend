import mongoose from "mongoose";

const educationalDetailsSchema = new mongoose.Schema(
	{
		name_of_education: {
			type: String,
		},
		start_year:{
			type: String,
		},
		passout_year: {
			type: String,
		},
		present: {
			type: Boolean,
			default: false,
		},
		is_education: {
			type: Boolean,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
		},
	},
	{ timestamps: true }
);

const EducationalDetails = mongoose.model(
	"EducationalDetails",
	educationalDetailsSchema
);

export default EducationalDetails;
