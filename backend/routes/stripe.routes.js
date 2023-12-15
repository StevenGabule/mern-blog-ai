const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated.middleware');
const {handleStripePayment, handleFreeSubscription, handleVerifyPayment} = require('../controllers/stripe.controller');
const stripeRouter = express.Router();

stripeRouter.post('/checkout', isAuthenticated, handleStripePayment);
stripeRouter.post('/free-plan', isAuthenticated, handleFreeSubscription);
stripeRouter.post('/verify-payment/:paymentId', isAuthenticated, handleVerifyPayment);

module.exports = stripeRouter;