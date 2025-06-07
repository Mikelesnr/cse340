// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const {
  validateInventory,
  validateClassification,
  handleValidationErrors,
} = require("../utilities/validation");

// Route to build inventory by classification view (with error handling)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get inventory item by ID (with error handling)
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.getInventoryById)
);

// Route to render inventory management view
router.get(
  "/management",
  utilities.handleErrors(invController.renderManagementView)
);

// Route to render classification addition form
router.get(
  "/add-classification",
  utilities.handleErrors(invController.renderAddClassificationView)
);

// Apply classification validation middleware before controller execution
router.post(
  "/classification",
  validateClassification,
  handleValidationErrors,
  utilities.handleErrors(invController.addClassification)
);

// Route to render inventory addition form
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.renderAddInventoryView)
);

// Apply inventory validation middleware before controller execution
router.post(
  "/add",
  validateInventory,
  handleValidationErrors,
  utilities.handleErrors(invController.addInventoryItem)
);

module.exports = router;
