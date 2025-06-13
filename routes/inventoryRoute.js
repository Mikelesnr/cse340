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
  verifyLoggedIn,
  restrictedAccess,
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

// **Route for editing inventory (restricted)**
router.get(
  "/edit/:inventoryId",
  verifyLoggedIn,
  restrictedAccess,
  utilities.handleErrors(invController.editInventoryView)
);

// **New Route for Updating Inventory**
router.post(
  "/update",
  verifyLoggedIn,
  restrictedAccess,
  validateInventory, // Ensuring the same validation rules are applied
  handleValidationErrors,
  utilities.handleErrors(invController.updateInventory) // ✅ Controller function will be added next
);

// Route to display delete confirmation view (restricted)
router.get(
  "/delete/:inventoryId",
  verifyLoggedIn,
  restrictedAccess,
  utilities.handleErrors(invController.deleteInventoryView)
);

// Route to process inventory deletion (restricted)
router.post(
  "/delete",
  verifyLoggedIn,
  restrictedAccess,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
