// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// GET /inventory/:id (for example)
//router.get('/:id', invController.getCarById);

module.exports = router;