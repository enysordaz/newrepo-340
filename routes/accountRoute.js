// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");
//Error route
const errorController = require('../controllers/errorController');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process Registration
//router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError);


module.exports = router;