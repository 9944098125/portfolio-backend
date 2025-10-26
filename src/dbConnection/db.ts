import mongoose from "mongoose";

export async function dbConnection() {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Server Connected to database successfully.");
	} catch (err: unknown) {
		throw new Error(err as any);
	}
}

mongoose.connection.on("connected", () => {
	console.log("Server Connecting to database...");
});

mongoose.connection.on("error", () => {
	console.log("Error while connecting to database xxx");
});
