const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/*
const carInventory = [
  {
    id: '1',
    title: "2019 Nissan Sentra SV CVT",
    mileage: "74,750",
    price: "$16,999",
    mpg: "29/37 (City / Hwy)",
    color: "Unknown",
    intColor: "Black",
    fuelType: "Gasoline",
    drive: "Front Wheel Drive",
    transmission: "Xtronic CVT",
    vin: "3N1AB7AP3KY362032",
    stock: "B0LD8Q",
    phone: "801-396-7886",
    image: "/images/sentra.jpg"
  }
];

exports.getCarById = (req, res) => {
  const carId = req.params.id;
  const car = carInventory.find(c => c.id === carId);
  
  if (!car) {
    return res.status(404).send('Car not found');
  }

  res.render('car', { car });
};
*/


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

module.exports = invCont