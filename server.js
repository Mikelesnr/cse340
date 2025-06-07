const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorRoute = require("./routes/errorRoute"); // NEW: 500 Error Trigger Route
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/index");
const session = require("express-session");
const pool = require("./database/");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

const app = express();

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
 * Routes
 *************************/
app.use(static);

// Apply error-handling middleware to all routes
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", utilities.handleErrors(inventoryRoute));
app.use("/account", utilities.handleErrors(accountRoute));
app.use("/error", utilities.handleErrors(errorRoute)); // NEW: 500 Error Test Route

/* ***********************
 * File Not Found Route
 *************************/
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Oops! It looks like this page went on an adventure. 🏔️",
  });
});

/* ***********************
 * Global Express Error Handler (Displays Errors in Footer)
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}": ${err.message}`);

  res.locals.error = err.message || "Oh no! Something went wrong.";

  res.render("errors/error", {
    title: err.status || "Server Error",
    message: res.locals.error,
    nav,
  });
});

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
