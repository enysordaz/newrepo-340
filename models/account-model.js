const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(accountId) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email 
       FROM public.account 
       WHERE account_id = $1`,
      [accountId]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    throw error
  }
}

/* *****************************
* Update Account
* ***************************** */
async function updateAccount(id, first, last, email) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1, account_lastname = $2, account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const data = await pool.query(sql, [first, last, email, id])
    return data.rowCount > 0
  } catch (error) {
    console.error("updateAccount error:", error)
    throw error
  }
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById , updateAccount }