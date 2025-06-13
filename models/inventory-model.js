const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    throw error;
  }
}

/* ***************************
 *  Get inventory item by ID
 * ************************** */
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inventory_id]
    );
    if (data.rows.length === 0) {
      return null; // No record found
    }
    return data.rows[0]; // Return the first row if it exists
  } catch (error) {
    console.error("getInventoryById error:", error);
    throw error;
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]; // Return inserted classification
  } catch (error) {
    console.error("addClassification error:", error);
    throw error; // Ensure error is caught by controller
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventoryItem(itemData) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

    const values = [
      itemData.classification_id,
      itemData.inv_make,
      itemData.inv_model,
      itemData.inv_year,
      itemData.inv_description,
      itemData.inv_image,
      itemData.inv_thumbnail,
      itemData.inv_price,
      itemData.inv_miles,
      itemData.inv_color,
    ];

    const result = await pool.query(sql, values);
    return result.rows[0]; // Return inserted inventory item
  } catch (error) {
    console.error("addInventoryItem error:", error);
    throw error; // Ensure error is caught by controller
  }
}

/* ***************************
 *  Update Inventory Item
 * ************************** */
async function updateInventoryItem(itemData) {
  try {
    const sql = `
      UPDATE public.inventory
      SET classification_id = $1, inv_make = $2, inv_model = $3, inv_year = $4, 
          inv_description = $5, inv_image = $6, inv_thumbnail = $7, 
          inv_price = $8, inv_miles = $9, inv_color = $10
      WHERE inv_id = $11
      RETURNING *`;

    const values = [
      itemData.classification_id,
      itemData.inv_make,
      itemData.inv_model,
      itemData.inv_year,
      itemData.inv_description,
      itemData.inv_image,
      itemData.inv_thumbnail,
      itemData.inv_price,
      itemData.inv_miles,
      itemData.inv_color,
      itemData.inv_id, // Ensure we update the correct inventory item
    ];

    const result = await pool.query(sql, values);
    return result.rows[0]; // Return the updated inventory item
  } catch (error) {
    console.error("updateInventoryItem error:", error);
    throw error; // Ensure error is caught by the controller
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    throw new Error("Delete Inventory Error");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateInventory,
};
