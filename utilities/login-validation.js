const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // Email is required and must be valid
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

/* **********************************
 * Check login data and return errors or proceed
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email, // Sticky input for email field
    });
    return;
  }
  next();
};

module.exports = validate;
