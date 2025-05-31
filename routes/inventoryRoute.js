// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get inventory item by ID
router.get("/detail/:inventoryId", invController.getInventoryById);

module.exports = router;
