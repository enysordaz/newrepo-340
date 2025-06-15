const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const pool = require('../database')
const { validationResult } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by car view
 * ************************** */
invCont.getCarById = async function (req, res, next) {
  const carId = req.params.id
  const car = await invModel.getVehicleByID(carId)
  const nav = await utilities.getNav()
  const detailView = await utilities.buildDetailView(car)
  res.render('./inventory/detail', {
    title: `${car.inv_year} ${car.inv_make} ${car.inv_model}`,
    nav,
    detailView
  })
}

/* ***********************************
 *  Build New Classification View 
 * ********************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("message"),
      errors: null,
      classification_name: "",
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Add the new Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try{
    const nav = await utilities.getNav()
    const { classification_name } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: null,
        errors: errors.array(),
        classification_name,
      })
    }

    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("message", `Classification "${classification_name}" added successfully.`)
      return res.redirect("/inv");
    } else {
      const message = "Failed to add classification. Please try again."
      res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message,
        errors: null,
        classification_name,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***********************************
 *  Build New Inventory View 
 * ********************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try{
    const nav = await utilities.getNav()
    const classifications = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList: classifications,
      message: req.flash("message"),
      errors:null,
      inventory: {},
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add the new Inventory/Vehicle
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classifications = await utilities.buildClassificationList(req.body.classification_id)
    const errors = validationResult(req)

    const inventory = {
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
    }

    if (!errors.isEmpty()) {
      return res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList: classifications,
        message: null,
        errors: errors.array(),
        inventory,
      })
    }
    const result = await invModel.addInventory(inventory)

    if (result) {
      req.flash("message", "Vehicle added successfully.")
      return res.redirect("/inv")
    } else {
      const message = "Failed to add vehicle."
      res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList: classifications,
        message,
        errors: null,
        inventory,
      })
    }
  } catch (error) {
    next(error)
  }
}


invCont.managementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}


module.exports = invCont