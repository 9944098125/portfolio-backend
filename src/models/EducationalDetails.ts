import mongoose from "mongoose";

const educationalDetailsSchema = new mongoose.Schema(
	{
		name_of_education: {
			type: String,
		},
		passout_year: {
			type: String,
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
