// Imports
const express = require("express");
const mongoose = require("mongoose");

// Router Setup
const inventoryRouter = express.Router();

// Schema & Model Setup
const inventorySchema = new mongoose.Schema({
  name: String,
  serial: String,
  quantity: Number,
  date: String,
  description: String,
});

inventorySchema.index({'$**' : 'text'});
const Inventory = mongoose.model("Inventory", inventorySchema);

// Routes
// GET      /api/products           : get all products
// GET      /api/products/:id       : get a product by id
// POST     /api/products           : add a new product
// PATCH    /api/products/:id       : update an existing product
// DELETE   /api/products/:id       : delete an existing product

inventoryRouter.get("/", async (req, res) => {
  try {
    const respo = await Inventory.find({});
    res.send(respo);
  } catch {
    res.send("error");
  }
});

inventoryRouter.post("/", async (req, res) => {
    const { name, serial, dateEntry, quantity, description } = req.body;
    let date = dateEntry;
    const invToInsert = new Inventory({ name, serial, date, quantity, description });
    console.log(invToInsert);
    try {
      await invToInsert.save();
      res.send("success");
    } catch {
      res.send("error");
    }
});

inventoryRouter.put('/:id' , async (req,res) => {

  const { name, serial, date, quantity, description } = req.body;

  try {
    const existingInv = await Inventory.findById(req.params.id);

    existingInv.name = name;
    existingInv.serial = serial;
    existingInv.date = date;
    existingInv.quantity = quantity;
    existingInv.description = description;
  
    await existingInv.save();
    res.send("success");
    
  } catch {
    res.send("error");
  }
});

inventoryRouter.delete("/:id", async (req, res) => {
  try {
      await Inventory.findByIdAndDelete(req.params.id);
      res.send("success");
  } catch (err) {
      console.log(err);
      res.send("error");
  }
});


inventoryRouter.delete("/", async (req, res) => {
  try {
    await Inventory.deleteMany({});
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error", err);
  }
});

// Exporting our router
module.exports.inventoryRouter = inventoryRouter;
module.exports.inventoryModel = Inventory;