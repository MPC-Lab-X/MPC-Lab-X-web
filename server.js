/**
 * @file server.js
 * @description Server configuration and initialization.
 */

// Load environment variables from .env file
require("dotenv").config();

// Load required modules
const express = require("express");
const routes = require("./src/routes");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const app = express();

// Middleware setup
app.use(express.static("public"));

// Load the renderer (EJS)
app.set("views", "./src/views");
app.set("view engine", "ejs");

// Routes setup
app.use("/", routes);

// Start the server
const server = app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});

// Handle SIGTERM gracefully
process.on("SIGTERM", async () => {
  console.info("SIGTERM signal received.");
  console.log("Closing server...");
  await app.close();
});

// Handle SIGINT gracefully
process.on("SIGINT", async () => {
  console.info("SIGINT signal received.");
  console.log("Closing server...");
  await app.close();
});

app.close = () => {
  server.close();
};

module.exports = app;
