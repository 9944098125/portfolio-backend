import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./dbConnection/db";

import authRoute from "./routes/auth";
import contactsRoute from "./routes/contacts";
import projectsRoute from "./routes/projects";
import skillsRoute from "./routes/skills";
import educationalDetailsRoute from "./routes/educationalDetails";

dotenv.config();
const app = express();

app.use(cors());
// to allow the frontend to use this backend app
app.use(cookieParser());
// to parse the cookies generated while login or any other processes
app.use(express.json());
// to parse the express data into json
app.use(bodyParser.json());
// to parse the bodyParser data to json
app.use(bodyParser.urlencoded({ extended: true }));
// to allow nested objects in the request body I don't know

// routes for different api's
app.use("/api/auth", authRoute);
app.use("/api/contacts", contactsRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/skills", skillsRoute);
app.use("/api/educational-details", educationalDetailsRoute);

// next error if request is not valid
app.use((error: any, req: Request, res: Response, next: Function): void => {
	const errStatus = error.status || 500;
	const errMessage = error.message || "Something went wrong";
	res.status(errStatus).json({
		message: errMessage,
		success: false,
		stack: error.stack,
	});
	return;
});

const port = process.env.PORT || 5051;

app.listen(port, () => {
	dbConnection();
	console.log(`🚀 Server running at http://localhost:${port}`);
});

// for secret token require('crypto').randomBytes(64).toString('hex')
