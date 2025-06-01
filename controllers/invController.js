const invModel = require("../models/inventory-model");
const utilities = require("../utilities/index");

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

    // Handle case where data is empty or undefined
    if (!data || data.length === 0) {
      return next({
        status: 404,
        message: "No vehicles found for the given classification.",
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
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

    // Handle case where no record is found
    if (!data) {
      return next({
        status: 404,
        message: "No inventory record found for the given ID.",
      });
    }

    const nav = await utilities.getNav();
    const vehicleHtml = utilities.buildVehicleHtml(data);

    res.render("./inventory/vehicle", {
      title: `${data.inv_make} ${data.inv_model} (${data.inv_year})`,
      nav,
      vehicleHtml,
    });
  } catch (error) {
    console.error("Error in getInventoryById:", error);
    next({
      status: error.status || 500,
      message: "Something went wrong while fetching inventory data.",
    });
  }
};

module.exports = invCont;
