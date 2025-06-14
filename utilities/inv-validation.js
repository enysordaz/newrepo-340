const utilities = require(".")
const { body, validateResult } = require("express-validator")
const validateRules = {}
const inventoryModel = require("../models/inventory-model")

//const { body } = require("express-validator")

/*  **********************************
*  Classification Validation Rules
* ********************************* */
validateRules.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9\s\-']+$/).withMessage("Only letters, numbers, spaces, hyphens, and apostrophes are allowed.")
      .custom(async (account_email) => {
          const clasificationExists = await inventoryModel.checkExistingEmail(account_email)
          if (clasificationExists){
          throw new Error("Classification exists. Please create a new Classification")
          }
      }),
  ]
}

/*  **********************************
*  Check data and return errors or continue to Add new Classification
* ********************************* */
validateRules.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validateResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validateRules.inventoryValidationRules = () =>{
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required"),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required"),
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year ir required"),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image is required"),
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required"),
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required"),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required"),
  ]
} 

/* ******************************
 * Check data and return errors or continue to add new Vehicle/Inventory
 * ***************************** */
validateRules.checkLoginData = async (req, res, next) => {
  const { inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, inv_price, 
    inv_miles, 
    inv_color } = req.body
  let errors = []
  errors = validateResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory/Vehicle",
      nav,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, inv_price, 
      inv_miles, 
      inv_color,
    })
    return
  }
  next()
}


module.exports = validateRules //{ classificationRules, inventoryValidationRules }