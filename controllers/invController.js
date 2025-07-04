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
  let nav = await utilities.getNav()
  // Prevent crash when no vehicles are found
  if (!data || data.length === 0) {
    req.flash("notice", "No vehicles found for this classification.")
    return res.status(404).render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: "<p>No vehicles available.</p>"
    })
  }
  
  const grid = await utilities.buildClassificationGrid(data)
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect,
  })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***********************************
 *  Build Edit Inventory View 
 * ********************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleByID(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Update Inventory Data 
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***********************************
 *  Build Delete Inventory View 
 * ********************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleByID(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Delete Inventory Data 
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const deleteResult = await invModel.deleteInventoryItem(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont