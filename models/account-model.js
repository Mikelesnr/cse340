const pool = require("../database/");

/* *****************************
 *   Register new account
 ***************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result.rows[0]; // Return the newly created account
  } catch (error) {
    console.error("Error registering account:", error);
    return null;
  }
}

/* **********************
 *   Check for existing email
 ********************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount > 0; // Return true if email exists
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

/* *****************************
 * Return account data using email address
 ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0] || null; // Return account data or null if not found
  } catch (error) {
    console.error("Error retrieving account by email:", error);
    return null;
  }
}

/* *****************************
 * Retrieve account details by account_id
 ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error retrieving account by ID:", error);
    return null;
  }
}

/* *****************************
 * Update account information
 ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return result.rowCount > 0; // Return true if update was successful
  } catch (error) {
    console.error("Error updating account information:", error);
    return false;
  }
}

/* *****************************
 * Update password (hashed)
 ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql =
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rowCount > 0; // Return true if password was updated
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};
