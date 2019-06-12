const express = require('express');
const router = express.Router();
const Product = require('../model/product');

router.use(express.json());

router.post('/', async (req, res) => {

  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    imgUrl: req.body.imgUrl
  });

  try {
    const saveProduct = await product.save();
    res.status(201).send(saveProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/search/:searchWord', async (req, res) => {

  const {searchWord} = req.params;
  const product = await Product.find({$text: {$search: searchWord}});

  if (product) {
    res.send(product);
  } else {
    res.status(404).end();
  }
});


router.get('/', async (req, res) => {
  const product = await Product.find();
  res.send(product);
});


router.get('/promo', async (req, res) => {
  const product = await Product.find({promo: {$exists: true}});
  if (product) {
    res.send(product);
  } else {
    res.status(404).end();
  }
});


router.get('/category', async (req, res) => {
  await Product.distinct('category').then((sortList) => {
    sortList.sort();
    res.send(JSON.stringify(sortList));
  });
});


router.get('/category/:category', async (req, res) => {
  try {
    const {category} = req.params;
    const product = await Product.find({category: category});
    if (product) {
      res.send(product);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
