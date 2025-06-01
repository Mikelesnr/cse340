const express = require("express");
const router = express.Router();
utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router; // Make sure this is correctly exporting the router
