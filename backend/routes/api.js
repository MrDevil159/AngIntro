const express = require('express');
const router = express.Router();
const products = require('../model/product.js');




 router.get('/products', async (req, res) => {
  try {
    const product = await products.find({});
    res.json(product);
    console.log(product)
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).send('Internal Server Error');
  }
});
  
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await products.find({ id:productId });
    res.json(product);
    console.log(product)
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await products.find({ id:productId });
    res.json(product);
    console.log(product)
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await products.findOneAndDelete({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
    console.log('Deleted product:', product);
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/products', async (req, res) => {
  try {
    const highestIdProduct = await products.findOne().sort({ id: -1 });
    const highestId = highestIdProduct ? highestIdProduct.id : 0;
    const newProduct = {
      id: highestId + 1,
      title: req.body.title,
      body: req.body.body,
      amount: req.body.amount
    };
    const createdProduct = await products.create(newProduct);
    res.status(201).json(createdProduct);
    console.log('Created product:', createdProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;
    console.log(updatedProductData);
    const filter = { id: productId };
    const update = { title: updatedProductData.title, body: updatedProductData.body, amount: updatedProductData.amount };
    const options = { new: true }; 

    const updatedProduct = await products.findOneAndUpdate(filter, update, options);

    if (updatedProduct) {
      res.json(updatedProduct);
      console.log('Product updated successfully:', updatedProduct);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
