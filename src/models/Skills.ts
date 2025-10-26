import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		level: {
			type: ["Beginner", "Intermediate", "Expert"],
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
		},
	},
	{ timestamps: true }
);

const Skills = mongoose.model("Skills", skillsSchema);

export default Skills;
