import express from "express";
import { Request, Response, NextFunction } from "express";
import * as http from "http";
import passport from "passport";
import { config } from "./config/config";
import { DB } from "./models/db";
var expressValidator = require("express-validator");
const XLSX = require("xlsx");
const multer = require("multer");
const cookieParser = require("cookie-parser");

// const CPUUtilize = require("./controllers/monitor");

var cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const db = new DB();
const port = config.port || 9090;
const mongodbURI =
  config.mongodbURI || "mongodb://localhost:27017/taskAssessment";
const LABEL = config.serviceName;
app.use(cookieParser());

app.set("port", port);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use("/test", (req, res) => {
  res.send(config.serviceName + "is LIVE");
});

db.connectWithRetry(mongodbURI);

//allow requests from any host
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(passport.initialize());
const corsMiddleware = (req, res, next) => {
  // Dynamically determine allowed origin based on the request
  const allowedOrigin = determineAllowedOrigin(req);
  // Set the Access-Control-Allow-Origin header
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).send();
  } else {
    // Continue with the next middleware or route handler for non-OPTIONS requests
    next();
  }
};

// Example function to determine the allowed origin
const determineAllowedOrigin = (req) => {
  const requestOrigin = req.headers["origin"];
  return requestOrigin || "*"; // Use '*' to allow any origin
};
// Use the CORS middleware for all routes
app.use(corsMiddleware);

app.use("/test", (req, res) => {
  res.send(config.serviceName + " is LIVE");
});

//Login route access
const routeAccess = require("./routes/auth/login");

//Route Access
app.use("/v1", require("./routes/dbRouter"));
app.use("/auth", routeAccess);
app.use("/v1", require("./routes/userPost/post"));

//start the server
server.listen(port, () => {
  console.log(LABEL + "is runnning on port " + port);
});

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).send("Page/Api not found");
});

module.exports = app;
