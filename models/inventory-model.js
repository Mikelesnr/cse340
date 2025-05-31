const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

// async function getClassificationById(classification_id) {
//   const data = await pool.query(
//     "SELECT * FROM public.classification WHERE classification_id = $1 ORDER BY classification_name",
//     [classification_id]
//   );
//   return data.rows[0];
// }

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
  }
}

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
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
};
