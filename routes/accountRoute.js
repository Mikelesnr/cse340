const express = require("express");
const router = express.Router();
const utilities = require("../utilities/index");
const { verifyLoggedIn } = require("../utilities/authMiddleware");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const loginValidate = require("../utilities/login-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build Register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build account management view (accessible to all logged-in users)
router.get(
  "/management",
  verifyLoggedIn, // Allows Clients, Employees, and Admins
  utilities.handleErrors(accountController.buildManagement)
);

// Route to render account update view (accessible to all logged-in users)
router.get(
  "/update/:id",
  verifyLoggedIn, // Ensures the user is logged in
  utilities.handleErrors(accountController.buildAccountUpdateView)
);

// Route to process account updates (accessible to all logged-in users)
router.post(
  "/update/:id",
  verifyLoggedIn, // Ensures the user is logged in
  regValidate.updateRules(),
  utilities.handleErrors(accountController.updateAccount)
);

// Route to process password update (accessible to all logged-in users)
router.post(
  "/update-password/:id",
  verifyLoggedIn, // Ensures the user is logged in
  regValidate.checkPasswordStrength,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to process logout
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
