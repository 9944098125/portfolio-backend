"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = dbConnection;
const mongoose_1 = __importDefault(require("mongoose"));
async function dbConnection() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Server Connected to database successfully.");
    }
    catch (err) {
        throw new Error(err);
    }
}
mongoose_1.default.connection.on("connected", () => {
    console.log("Server Connecting to database...");
});
mongoose_1.default.connection.on("error", () => {
    console.log("Error while connecting to database xxx");
});
