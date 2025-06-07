// Needed Resources 
const express = require("express")
const router = new express.Router() 
//Double check this
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController");

//Error route
const errorController = require('../controllers/errorController');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError);



module.exports = router;