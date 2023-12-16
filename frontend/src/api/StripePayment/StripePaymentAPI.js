import axios from 'axios'

export const handleFreeSubscriptionAPI = async() => {
	return await axios.post('http://localhost:4000/api/v1/stripe/free-plan', {}, {withCredentials: true})?.data;
}

export const createStripePaymentIntentAPI = async(payment) => {
	return await axios.post('http://localhost:4000/api/v1/stripe/checkout', {
		amount: Number(payment?.amount),
		subscriptionPlan: payment?.plan,
	}, {withCredentials: true})?.data;
}

export const verifyPaymentAPI = async(paymentId) => {
	return await axios.post(`http://localhost:4000/api/v1/stripe/verify-payment/${paymentId}`, {}, {withCredentials: true})?.data;
}