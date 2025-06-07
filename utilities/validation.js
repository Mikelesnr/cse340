const { body, validationResult } = require("express-validator");

const validateInventory = [
  body("classification_id")
    .notEmpty()
    .withMessage("Classification is required."),
  body("inv_make").notEmpty().withMessage("Make is required."),
  body("inv_model").notEmpty().withMessage("Model is required."),
  body("inv_year")
    .isInt({ min: 1900 })
    .withMessage("Year must be a valid number."),
  body("inv_price")
    .isFloat({ min: 1 })
    .withMessage("Price must be a valid number."),
  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a valid number."),
  body("inv_color").notEmpty().withMessage("Color is required."),
  body("inv_description").notEmpty().withMessage("Description is required."),
  body("inv_image").notEmpty().withMessage("Image path or URL is required."),
  body("inv_thumbnail")
    .notEmpty()
    .withMessage("Thumbnail path or URL is required."),
];

const validateClassification = [
  body("classification_name")
    .trim()
    .notEmpty()
    .withMessage("Classification name cannot be empty.")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Classification name must contain only letters and numbers."),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors.array().map((error) => error.msg)
    ); // Store all error messages
    req.flash("formData", req.body); // Store input values for persistence

    if (req.originalUrl.includes("/classification")) {
      return res.redirect("/inv/add-classification");
    } else if (req.originalUrl.includes("/add")) {
      return res.redirect("/inv/add-inventory");
    }
  }

  next(); // Proceed if no validation errors
};

module.exports = {
  validateInventory,
  validateClassification,
  handleValidationErrors,
};
