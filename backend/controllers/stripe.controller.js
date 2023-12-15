const asyncHandler = require('express-async-handler');
const { shouldRenewSubscriptionPlan } = require('../utils/shouldRenewSubscriptionPlan');
const { calculateNextBillingDate } = require('../utils/calculateNextBillingDate');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Payment = require('../models/Payment.model');
const User = require('../models/User.model');

const handleStripePayment = asyncHandler(async(req, res) => {
	const {amount, subscriptionPlan} = req.body
	const user = req.user;
	try {
		const paymentIntent = await stripe.paymentIntents.create({ 
			amount: Number(amount) * 100, 
			currency: 'usd',
			metadata: {
				userId: user?._id?.toString(),
				userEmail: user?.email,
				subscriptionPlan
			}
		})

		res.json({
			clientSecret: paymentIntent?.client_secret,
			paymentId: paymentIntent?.id,
			metadata: paymentIntent?.metadata
		})

	} catch (error) {
		console.error(error);
		res.status(500).json({error})
	}
})

const handleFreeSubscription = asyncHandler(async(req, res) => {
	const user = req?.user;
	try {
		if(shouldRenewSubscriptionPlan(user)) {
			user.subscriptionPlan = "Free"
			user.monthlyRequestCount = 5;
			user.apiRequestCount = 0;
			user.nextBillingDate = calculateNextBillingDate();

			// create new payment and save to db
			const newPayment = await Payment.create({
				user: user?._id,
				subscriptionPlan: 'Free',
				amount: 0,
				status: 'success',
				reference: Math.random().toString(16).substring(7),
				monthlyRequestCount: 5,
				currency: 'usd'
			})
			user.payments.push(newPayment?._id);
			await user.save();

			return res.json({
				status: "succes",
				message: 'Subscription plan updated successfully.',
				user,
			})
		} else {
			return res.status(403).json({error: 'Subscription renewal not due yet.'})
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({error})
	}
})

const handleVerifyPayment = asyncHandler(async(req, res) => {
	const {paymentId} = req.params;
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
		if (paymentIntent.status === 'succeeded') {
			const metadata = paymentIntent?.metadata;
			const subcriptionPlan = metadata?.subscriptionPlan;
			const userEmail = metadata?.userEmail;
			const userId = metadata?.userId;

			// find the user
			const userFound = await User.findById(userId);
			if(!userFound) return res.status(401).json({status:false, message: 'User not found.'})

			// get the payment history
			const amount = paymentIntent?.amount / 100;
			const current = paymentIntent?.currency;
			const paymentId = paymentIntent?.id

			// create the payment history
			const newPayment = await Payment.create({ user: userId, email: userEmail, subscriptionPlan, amount, currency, status: 'success', reference: paymentId })
			if(subscriptionPlan === 'Basic') {
				const updatedUser = await User.findByIdAndUpdate(userId, {
					subscriptionPlan,
					trialPeriod: 0,
					nextBillingDate: calculateNextBillingDate(),
					apiRequestCount: 0,
					monthlyRequestCount: 50,
					subscriptionPlan: 'Basic',
					$addToSet: {payments: newPayment?._id}
				});
				res.json({
					status: true,
					message: 'Payment verified, user updated.',
					updatedUser
				})
			}
			if(subscriptionPlan === 'Premium') {
				const updatedUser = await User.findByIdAndUpdate(userId, {
					subscriptionPlan,
					trialPeriod: 0,
					nextBillingDate: calculateNextBillingDate(),
					apiRequestCount: 0,
					monthlyRequestCount: 100,
					subscriptionPlan: 'Premium',
					$addToSet: {payments: newPayment?._id}
				});
				res.json({
					status: true,
					message: 'Payment verified, user updated.',
					updatedUser
				})
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({error})
	}
})

module.exports = {handleStripePayment, handleFreeSubscription, handleVerifyPayment};