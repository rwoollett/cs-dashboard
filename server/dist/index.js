"use strict";
// server/index.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_process_1 = __importDefault(require("node:process"));
const node_child_process_1 = require("node:child_process");
dotenv_1.default.config();
const port = node_process_1.default.env.PORT;
const app = (0, express_1.default)();
app.get("/api", (req, res) => {
    res.json({ message: "Hello 21 from server!" });
});
app.post("/api/client/start", (req, res) => {
    const ls = (0, node_child_process_1.spawn)('./nm_go.sh', [], {
        detached: true,
        stdio: 'ignore',
        cwd: '../../netprocessor'
    });
    ls.unref();
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    res.json({ Success: true });
});
app.post("/api/client/stop", (req, res) => {
    const ls = (0, node_child_process_1.spawn)('./nm_stop.sh', [], {
        detached: true,
        stdio: 'ignore',
        cwd: '../../netprocessor'
    });
    ls.unref();
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    res.json({ Success: true });
});
// All other GET requests not handled before will return our React app
if (node_process_1.default.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../front-end/build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../../front-end/build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
// ///////
// const ls = spawn('./nm_go.sh', [], {
//   cwd: '../../netprocessor'
// });
// ls.unref();
// // ls.stdout.on('data', (data) => {
// //   console.log(`stdout: ${data}`);
// // });
// // ls.stderr.on('data', (data) => {
// //   console.error(`stderr: ${data}`);
// // });
// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });
