// Needed Resources 
const express = require("express")
const router = new express.Router() 
const { body } = require("express-validator")
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inv-validation")
//Error route
const errorController = require('../controllers/errorController')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// GET /inventory/:id (for example)
router.get('/detail/:id', invController.getCarById);


/** ********************
 * Route to build Add Classification view
 *********************** */
// Route to build Classification view
router.get("/add-classification", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin, 
  utilities.handleErrors(invController.buildAddClassification)
)

// Process the New Classification Data
router.post(
  "/add-classification",
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required")
    .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed"),
  invController.addClassification
)

/** ********************
 * Route to build Inventory Details view
 *********************** */
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryValidationRules(), 
  utilities.handleErrors(invController.addInventory)
)

//Route for /inv & Management and updating view
router.get('/', invController.managementView)
// Protect inventory management
router.get(
  "/management",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.managementView)
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON)) //utilities.checkAccountType,

/** ********************
 * Update Inventory Router
 *********************** */
router.get(
  "/edit/:inv_id", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

//Route to update the Inventory
router.post(
  "/update/", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  invValidate.checkUpdateData, 
  utilities.handleErrors(invController.updateInventory)
)

/** ********************
 * Delete Inventory Route
 *********************** */
router.get(
  "/delete/:inv_id", 
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryView)
)

router.post(
  "/delete/",
  utilities.checkJWTToken,
  utilities.checkEmployeeOrAdmin, 
  invValidate.checkUpdateData, 
  utilities.handleErrors(invController.deleteInventoryItem)
)

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError)

module.exports = router;