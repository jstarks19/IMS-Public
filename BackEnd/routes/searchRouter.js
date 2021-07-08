// Imports
const express = require("express");
const mongoose = require("mongoose");

const {productModel} = require('./productRouter');
const {inventoryModel} = require('./inventoryRouter');



// Router Setup
const searchRouter = express.Router();

searchRouter.get("/", async (req, res) => {
  console.log('SEARCH');
  
  try {
    
    const filter = req.query.filter;
    const searchText = req.query.term;

    const searchParams = (searchText === "") ? {} : {$text: {$search: searchText}};
  

    // initialize search results
    let prodRes = [];
    let inveRes = [];
    let result = {products: prodRes, inventory: inveRes};

    switch(filter) {
        case 'all':
            result.products = await productModel.find(searchParams)
            result.inventory = await inventoryModel.find(searchParams);
            break;
        case 'product':
            result.products = await productModel.find(searchParams);
            break;
        case 'inventory':
            result.inventory = await inventoryModel.find(searchParams);
            break;
    }
    res.json(JSON.stringify(result));
  } catch {
    res.send("error");
  }
});

// productRouter.get('/:id' , (req,res) => {
//     console.log(`get product => ${req.params.id}`);
//     res.send(`GET Product ${req.params.id}`);
// });

searchRouter.post("/", async (req, res) => {
  try {
    res.send("success");
  } catch {
    res.send("error");
  }
});

// productRouter.patch('/:id' , (req,res) => {
//     console.log(`patch product => ${req.params.id}`);
//     res.send('PATCH Product');
// });

searchRouter.delete("/", async (req, res) => {
  try {
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error", err);
  }
});

// Exporting our router
module.exports.searchRouter = searchRouter;
