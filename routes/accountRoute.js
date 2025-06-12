// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController");
//Error route
const errorController = require('../controllers/errorController');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process Registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError);




module.exports = router;