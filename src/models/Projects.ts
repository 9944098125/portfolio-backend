import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema(
	{
		thumbnail: {
			type: String,
		},
		name: {
			type: String,
		},
		skills: {
			type: [String],
		},
		description: {
			type: String,
		},
		liveDemo: {
			type: String,
		},
		githubLink: {
			type: String,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
		},
	},
	{ timestamps: true }
);

const Projects = mongoose.model("Projects", projectsSchema);

export default Projects;
