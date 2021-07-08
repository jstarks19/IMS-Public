// Imports
const express = require("express");
const mongoose = require("mongoose");

// Router Setup
const productRouter = express.Router();

// Schema & Model Setup
const productSchema = new mongoose.Schema({
  group: String,
  series: String,
  name: String,
  serials: [String],
  quantity: Number,
  date: String,
  amountOfSale: Number,
  description: String,
});

productSchema.index({'$**' : 'text'});
const Product = mongoose.model("Product", productSchema);


// Routes
// GET      /api/products           : get all products
// GET      /api/products/:id       : get a product by id
// POST     /api/products           : add a new product
// PATCH    /api/products/:id       : update an existing product
// DELETE   /api/products/:id       : delete an existing product

productRouter.get("/", async (req, res) => {
  try {
    const respo = await Product.find({});
    res.send(respo);
  } catch {
    res.send("error");
  }
});

productRouter.post("/", async (req, res) => {
  const { group, series, serials, quantity, dateEntry, amountOfSale, description } = req.body;
  const name = group + "-" + series;
  const prodToInsert = new Product({ group, series, name, serials, quantity, date:dateEntry, amountOfSale, description });
  
  try {
    await prodToInsert.save();
    res.send("success");
  } catch {
    res.send("error");
  }
});

productRouter.put('/:id' , async (req,res) => {
  // const prodToInsert = new Inventory({ name, serial, date, quantity, description });
  
  const { group, series, serials, quantity, date, amountOfSale, description } = req.body;
  const name = group + "-" + series;

  try {
    const existingProd = await Product.findById(req.params.id);
    
    existingProd.group = group;
    existingProd.series = series;
    existingProd.name = name;
    existingProd.serials = serials;
    existingProd.quantity = quantity;
    existingProd.date = date;
    existingProd.amountOfSale = amountOfSale;
    existingProd.description = description;

    await existingProd.save();
    res.send("success");
    
  } catch {
    res.status(500).send("error");
  }
});

productRouter.delete("/:id", async (req, res) => {
  console.log('DELTEINGINGNG GIGNNG');
  try {
      await Product.findByIdAndDelete(req.params.id);
      res.send("success");
  } catch (err) {
      res.status.apply(500).send("error");
  }
});

productRouter.delete("/", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error", err);
  }
});

// Exporting our router
module.exports.productRouter = productRouter;
module.exports.productModel = Product;