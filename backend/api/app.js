const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// middleware routes
const login = require("./middleware/login");
const authEndpoint = require("./middleware/auth-endpoint");
const register = require("./middleware/register");
const testapi = require("./middleware/testapi");

// api routes
const changerole = require("./routes/changerole");
const deleteuser = require("./routes/deleteuser");
const getusers = require("./routes/getusers");
const userprofile = require("./routes/userprofile");
const createGroup = require("./routes/creategroup");
const getGroup = require("./routes/getgroup");
const getGroups = require("./routes/getgroups");
const putUserGroup = require("./routes/putusergroup");
const addTransaction = require("./routes/addtransaction");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Curb CORS Errors by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.STORE);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Server response
app.get("/", (response) => {
  response.json({ message: "Hey! Server is up and running!" });
});

// Require database connection and execute it
const dbConnect = require("../db/dbConnect");
const { populate } = require("../db/models/userModel");
dbConnect();

//test

app.use("/api", testapi);

app.use("/api", register);
app.use("/api", login);
app.use("/api", changerole);
app.use("/api", deleteuser);
app.use("/api", getusers);
app.use("/api", userprofile);
app.use("/api", authEndpoint);
app.use("/api", createGroup);
app.use("/api", getGroup);
app.use("/api", getGroups);
app.use("/api", putUserGroup);
app.use("/api", addTransaction);

module.exports = app;
