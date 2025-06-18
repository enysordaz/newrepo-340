// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");

//Error route
const errorController = require('../controllers/errorController');

/** ********************
 * Route to build login and Register view
 *********************** */
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/** ********************
 * Logout route
 *********************** */
router.get('/logout', utilities.handleErrors(accountController.logoutAccount))

/** ********************
 * Update account route
 *********************** */
router.get(
  "/update/:accountId", 
  utilities.checkJWTToken, 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateAccount)
)

router.post("/update",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError);

module.exports = router;