// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

//Error route
const errorController = require('../controllers/errorController');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// GET /inventory/:id (for example)
router.get('/detail/:id', invController.getCarById);

// New route to intentionally trigger 500 error
router.get('/trigger-error', errorController.throwServerError);

module.exports = router;