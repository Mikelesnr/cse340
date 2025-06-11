const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const {
  verifyLoggedIn,
  restrictedAccess,
} = require("../utilities/authMiddleware");
const {
  validateInventory,
  validateClassification,
  handleValidationErrors,
} = require("../utilities/validation");

// Route to build inventory by classification view (accessible to all)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get inventory item by ID (accessible to all)
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.getInventoryById)
);

// Route to render inventory management view (restricted to logged-in Employee/Admin)
router.get(
  "/management",
  verifyLoggedIn, // Check authentication first
  restrictedAccess, // Then check role
  utilities.handleErrors(invController.renderManagementView)
);

// Route to render classification addition form (restricted)
router.get(
  "/add-classification",
  verifyLoggedIn,
  restrictedAccess,
  utilities.handleErrors(invController.renderAddClassificationView)
);

// Apply classification validation middleware before controller execution (restricted)
router.post(
  "/classification",
  verifyLoggedIn,
  restrictedAccess,
  validateClassification,
  handleValidationErrors,
  utilities.handleErrors(invController.addClassification)
);

// Route to render inventory addition form (restricted)
router.get(
  "/add-inventory",
  verifyLoggedIn,
  restrictedAccess,
  utilities.handleErrors(invController.renderAddInventoryView)
);

// Apply inventory validation middleware before controller execution (restricted)
router.post(
  "/add",
  verifyLoggedIn,
  restrictedAccess,
  validateInventory,
  handleValidationErrors,
  utilities.handleErrors(invController.addInventoryItem)
);

module.exports = router;
