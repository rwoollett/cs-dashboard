"use strict";
// server/index.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.get("/api", (req, res) => {
    res.json({ message: "Hello 21 from server!" });
});
// All other GET requests not handled before will return our React app
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../front-end/build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../../front-end/build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
