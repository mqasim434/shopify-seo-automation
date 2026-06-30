const express = require('express');
const { verifyShopifyWebhook } = require('../utils/verify');
const { processProduct } = require('../services/processor');

const router = express.Router();

router.post('/product-created', (req, res) => {
  if (!verifyShopifyWebhook(req)) {
    console.log('→ Webhook rejected: 401 Unauthorized');
    return res.status(401).send('Unauthorized');
  }

  let product;
  try {
    product = JSON.parse(req.body.toString('utf8'));
  } catch (error) {
    console.error('Invalid webhook payload:', error.message);
    return res.status(400).send('Bad Request');
  }

  console.log(`→ Webhook accepted for product: ${product.title} (ID: ${product.id})`);
  res.status(200).send('OK');

  processProduct(product).catch((error) => {
    console.error('Unhandled error in processProduct:', error);
  });
});

module.exports = router;
