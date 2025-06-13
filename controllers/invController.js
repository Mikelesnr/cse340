const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/index");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (!data || data.length === 0) {
      return next({
        status: 404,
        message: "No vehicles found for the given classification.",
      });
    }

    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;

    res.render("layouts/layout", {
      title: `${className} Vehicles`,
      nav,
      body: grid,
    });
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    next({
      status: error.status || 500,
      message: "Something went wrong while fetching classification data.",
    });
  }
};

/* ***************************
 *  Get inventory item by ID
 * ************************** */
invCont.getInventoryById = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryById(inventory_id);

    if (!data) {
      return next({
        status: 404,
        message: "No inventory record found for the given ID.",
      });
    }

    const nav = await utilities.getNav();

    // Initialize accountData safely
    let accountData = {};

    // Check if user is logged in and retrieve account data
    if (req.cookies.jwt) {
      try {
        const decoded = jwt.verify(
          req.cookies.jwt,
          process.env.ACCESS_TOKEN_SECRET
        );
        accountData =
          (await accountModel.getAccountById(decoded.account_id)) || {};
      } catch (error) {
        console.warn("JWT verification failed:", error);
        res.clearCookie("jwt"); //Clear expired JWT session
      }
    }
    // Pass accountData to vehicleHtml to control button visibility
    const vehicleHtml = utilities.buildVehicleHtml(data, accountData);

    res.render("layouts/layout", {
      title: `${data.inv_make} ${data.inv_model} (${data.inv_year})`,
      nav,
      body: vehicleHtml,
    });
  } catch (error) {
    console.error("Error in getInventoryById:", error);
    next({
      status: error.status || 500,
      message: "Something went wrong while fetching inventory data.",
    });
  }
};

/* ***************************
 *  Render Inventory Management View (Task 1)
 * ************************** */
invCont.renderManagementView = async function (req, res) {
  const nav = await utilities.getNav();
  const flashMessage = req.flash("info");

  res.render("layouts/layout", {
    title: "Inventory Management",
    nav,
    body: utilities.buildManagementView(flashMessage),
  });
};

/* ***************************
 *  Render Classification Addition Form (Task 2)
 * ************************** */
invCont.renderAddClassificationView = async function (req, res) {
  const nav = await utilities.getNav();
  const flashMessage = req.flash("error");
  const formData = req.flash("formData")[0] || {}; // Retrieve stored form data

  res.render("layouts/layout", {
    title: "Add New Classification",
    nav,
    body: utilities.buildAddClassificationView(flashMessage, formData),
  });
};

/* ***************************
 *  Add New Classification (Task 2)
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const newClassification = await invModel.addClassification(
      req.body.classification_name
    );

    if (newClassification) {
      req.flash("info", "Classification added successfully!");
      return res.redirect("/inv/management");
    } else {
      req.flash("error", "Failed to add classification.");
      return res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error in addClassification:", error);
    next({ status: 500, message: "Error adding classification." });
  }
};

/* ***************************
 *  Render Inventory Addition Form (Task 3)
 * ************************** */
invCont.renderAddInventoryView = async function (req, res) {
  const nav = await utilities.getNav();
  const flashMessage = req.flash("error");
  const formData = req.flash("formData")[0] || {}; // Retrieve stored form data

  res.render("layouts/layout", {
    title: "Add New Vehicle",
    nav,
    body: await utilities.buildAddInventoryView(flashMessage, formData),
  });
};

/* ***************************
 *  Add New Inventory Item (Task 3)
 * ************************** */
invCont.addInventoryItem = async function (req, res, next) {
  try {
    const itemData = req.body; // Capture form input values
    const newItem = await invModel.addInventoryItem(itemData);

    if (newItem) {
      req.flash("info", "Vehicle added successfully!");
      return res.redirect("/inv/management");
    } else {
      req.flash("error", "Failed to add vehicle.");
      return res.render("layouts/layout", {
        title: "Add New Vehicle",
        nav: await utilities.getNav(),
        body: await utilities.buildAddInventoryView(
          req.flash("error"),
          itemData
        ), // Pass user input back
      });
    }
  } catch (error) {
    console.error("Error in addInventoryItem:", error);
    req.flash("error", "Error adding inventory item.");
    return res.render("layouts/layout", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      body: await utilities.buildAddInventoryView(req.flash("error"), req.body), // Preserve input
    });
  }
};

/* ***************************
 *  Build inventory edit view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventoryId);
    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
      return next({
        status: 404,
        message: "Inventory item not found.",
      });
    }

    const body = await utilities.buildEditInventoryView(null, itemData);

    res.render("inventory/edit-inventory", {
      title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      body,
      errors: null,
    });
  } catch (error) {
    console.error("Error in editInventoryView:", error);
    next({
      status: error.status || 500,
      message: "Error retrieving inventory details.",
    });
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    // Ensure properties exist before using them
    const itemName = `${updateResult?.inv_make ?? "Unknown"} ${
      updateResult?.inv_model ?? "Vehicle"
    }`;

    req.flash("notice", `The ${itemName} was successfully updated.`);
    return res.redirect(`/inv/detail/${updateResult?.inv_id}`);
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Delete Inventory View
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventoryId);
    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
      return next({
        status: 404,
        message: "Inventory item not found.",
      });
    }

    res.render("inventory/delete-confirm", {
      title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  } catch (error) {
    console.error("Error in deleteInventoryView:", error);
    next({
      status: error.status || 500,
      message: "Error retrieving inventory details.",
    });
  }
};

/* ***************************
 *  Process Delete Inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult.rowCount > 0) {
      req.flash("notice", "Inventory item deleted successfully.");
      return res.redirect("/inv/management");
    } else {
      req.flash("notice", "Inventory deletion failed.");
      return res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error("Error in deleteInventory:", error);
    req.flash("notice", "An unexpected error occurred.");
    return res.redirect(`/inv/delete/${req.body.inv_id}`);
  }
};

module.exports = invCont;
