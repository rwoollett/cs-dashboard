// server/index.js

import path from 'path';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import process from 'node:process';
import { spawn } from 'node:child_process';


dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello 21 from server!" });
});

app.post("/api/client/start", (req, res) => {
  const ls = spawn('./nm_go.sh', [], {
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
  const ls = spawn('./nm_stop.sh', [], {
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
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../front-end/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../front-end/build', 'index.html'));
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
