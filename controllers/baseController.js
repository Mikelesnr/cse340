const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("indexx", { title: "Home", nav });
};
module.exports = baseController;
