import mongoose from "mongoose";

const themesSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		primaryColor: {
			type: String,
		},
		secondaryColor: {
			type: String,
		},
		boldBg: {
			type: String,
		},
		background: {
			type: String,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
		},
	},
	{ timestamps: true }
);

const Themes = mongoose.model("Themes", themesSchema);

export default Themes;
