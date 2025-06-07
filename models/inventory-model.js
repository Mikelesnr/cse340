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

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventoryItem,
};
