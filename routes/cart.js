const express = require('express');
const router = express.Router();
const Cart = require('../model/cart');
const Product = require('../model/product');
const authMiddleware = require('../auth.middleware');

router.use(express.json());
router.use(authMiddleware);

//generate cart
router.post('/', async (req, res) => {
  try {
    //checking if user_id for user exists
    const cart = await Cart.findOne({user_id: req.user._id});

    if (cart) {
      res.status(200).send(cart);
    } else {
      const newCart = new Cart({
        user_id: req.user._id,
        products: []
      });
      const saveCart = await newCart.save();
      res.status(201).send(saveCart);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get cart
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({user_id: req.user._id}).sort('name');;
    if (cart) {
      res.send(cart);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//get quantity products in cart
router.get('/quantity', async (req, res) => {
  try {
    const cart = await Cart.findOne({user_id: req.user._id});

    if (cart) {

      let counterQuantity = 0;
      let priceTotal = 0;
      cart.products.map(p => {
        counterQuantity += +p.quantity;
        priceTotal += +p.priceTotal;
      });

      const objectRespone = {
        "quantity": counterQuantity,
        "priceTotal": priceTotal
      };

      res.send(objectRespone);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


//add product with quantity in cart
router.put('/:productId/:quantity([1-9]*)', async (req, res) => {
  try {
    const {productId, quantity} = req.params;
    const cart = await Cart.findOne({user_id: req.user._id});

    const product = await Product.findById(productId);
    if (product) {

      let newProducts = [];
      cart.products.map((p) => {
        if (p.product_id.toString() !== productId) {
          newProducts.push(p);
        }
      });

      const productForCart = {
        "product_id": product._id,
        "name": product.name,
        "price": product.price,
        "imgUrl": product.imgUrl,
        "quantity": +quantity,
        "priceTotal": product.price * +quantity,
        "dateAdd": new Date()
      };

      newProducts.push(productForCart);
      newProducts.sort((a, b) => a.price - b.price);

      await Cart.findOneAndUpdate({"_id": cart._id}, {$set: {products: newProducts}});
      const newCart = await Cart.findById(cart._id);

      res.send(newCart);
    } else {
      res.status(404).end();
    }

  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete product with cart
router.delete('/:productId', async (req, res) => {
  try {
    const {productId} = req.params;
    const cart = await Cart.findOne({user_id: req.user._id});
    const product = await Product.findById(productId);

    if (product) {

      let newProducts = [];
      cart.products.map((p) => {
        if (p.product_id.toString() !== productId) {
          newProducts.push(p);
        }
      });

      await Cart.findOneAndUpdate({"_id": cart._id}, {$set: {products: newProducts}});
      const newCart = await Cart.findById(cart._id).sort('name');;
      res.send(newCart);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete cart
router.delete('', async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({user_id: req.user._id});

    if (cart) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
