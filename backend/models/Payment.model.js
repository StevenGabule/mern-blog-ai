const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
	username: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	reference: { type: String, required: true},
	currency: { type: String, required: true},
	status: { type: String, default: "pending", required: true},
	subscriptionPlan: { type: String, required: true },
	amount: {type: Number, default: 0},
	monthlyRequestCount: {type: Number},
}, {
	timestamps: true
})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment;
