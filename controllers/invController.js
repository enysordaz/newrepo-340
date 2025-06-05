const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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

module.exports = invCont