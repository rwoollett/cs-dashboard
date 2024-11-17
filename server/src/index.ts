// server/index.js

import path from 'path';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();


app.get("/api", (req, res) => {
  res.json({ message: "Hello 21 from server!" });
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