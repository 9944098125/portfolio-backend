"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./dbConnection/db");
const auth_1 = __importDefault(require("./routes/auth"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const projects_1 = __importDefault(require("./routes/projects"));
const skills_1 = __importDefault(require("./routes/skills"));
const educationalDetails_1 = __importDefault(require("./routes/educationalDetails"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// to allow the frontend to use this backend app
app.use((0, cookie_parser_1.default)());
// to parse the cookies generated while login or any other processes
app.use(express_1.default.json());
// to parse the express data into json
app.use(body_parser_1.default.json());
// to parse the bodyParser data to json
app.use(body_parser_1.default.urlencoded({ extended: true }));
// to allow nested objects in the request body I don't know
// routes for different api's
app.use("/api/auth", auth_1.default);
app.use("/api/contacts", contacts_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/skills", skills_1.default);
app.use("/api/educational-details", educationalDetails_1.default);
// next error if request is not valid
app.use((error, req, res, next) => {
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
    (0, db_1.dbConnection)();
    console.log(`🚀 Server running at http://localhost:${port}`);
});
// for secret token require('crypto').randomBytes(64).toString('hex')
