const express = require("express");
const router = express.Router();
utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const loginValidate = require("../utilities/login-validation");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  (req, res) => {
    res.status(200).send("login process");
  }
);

module.exports = router; // Make sure this is correctly exporting the router
