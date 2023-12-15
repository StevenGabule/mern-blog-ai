require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const usersRouter = require('./routes/users.routes');
const openAIRouter = require('./routes/openai.routes');
const { errorHandler } = require('./middleware/error.middleware');
const stripeRouter = require('./routes/stripe.routes');
const User = require('./models/User.model');

require('./utils/database')();

const app = express();
const PORT = process.env.PORT || 5000;

// cron for the trial period: run every single day
cron.schedule('0 0 * * * *', async() => {
	try {
		const today = new Date();
		await User.updateMany({
			trialActive: true,
			trialExpires: {$lt: today}
		}, {
			trialActive: false,
			subscriptionPlan: 'Free',
			monthlyRequestCount: 5
		})
	} catch (error) {
		consoe.log(error)
	}
	// cron for the free plan: run at the end of the every month
	cron.schedule('0 0 1 * * *', async() => {
		try {
			const today = new Date();
			await User.updateMany({
				subscriptionPlan: 'Free',
				nextBillingDate: {$lt: today}
			}, {
				monthlyRequestCount: 0
			})
		} catch (error) {
			consoe.log(error)
		}
	})
	
	// cron for the basic plan: run at the end of the every month
	cron.schedule('0 0 1 * * *', async() => {
		try {
			const today = new Date();
			await User.updateMany({
				subscriptionPlan: 'Basic',
				nextBillingDate: {$lt: today}
			}, {
				monthlyRequestCount: 0
			})
		} catch (error) {
			consoe.log(error)
		}
	})
	// cron for the premium plan: run at the end of the every month
	cron.schedule('0 0 1 * * *', async() => {
		try {
			const today = new Date();
			await User.updateMany({
				subscriptionPlan: 'Premium',
				nextBillingDate: {$lt: today}
			}, {
				monthlyRequestCount: 0
			})
		} catch (error) {
			consoe.log(error)
		}
	})


app.use(express.json())
app.use(cookieParser)

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/openai', openAIRouter);
app.use('/api/v1/stripe', stripeRouter);

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))