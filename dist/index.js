"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
const routes_1 = require("./routes");
dotenv.config();
const mongoUrl = process.env.MONGO_URL;
mongoose_1.default
    .connect(mongoUrl)
    .then(() => {
    console.log(`DB connected`);
})
    .catch(() => {
    console.log(`DB connection failed`);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(cookieParser());
// app.use(express.static('src/uploadedImages'));
app.use((0, morgan_1.default)('dev'));
app.use(routes_1.indexRouter);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`the server is running on port ${port}`);
});
