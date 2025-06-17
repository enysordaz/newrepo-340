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

// Route to build Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process the New Classification Data
router.post(
  "/add-classification",
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required")
    .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed"),
  invController.addClassification
)

// Route to build Inventory Details view
router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", invValidate.inventoryValidationRules(), invController.addInventory)

//Route for /inv
router.get('/', invController.managementView)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//utilities.checkAccountType,
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditingInventory))

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError)

module.exports = router;