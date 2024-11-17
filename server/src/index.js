// server/index.js

const path = require('path');
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.static(path.resolve(__dirname, '../../front-end/build')));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../front-end/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});