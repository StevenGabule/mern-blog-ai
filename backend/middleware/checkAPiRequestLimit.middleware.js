const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');

const checkAPiRequestLimit = asyncHandler(async(req, res, next) => {
	if(!req.user) return res.status(401).json({ message: 'Unauthenticated.'})

	const user = await User.findById(req.user.id);
	if(!user) return res.status(401).json({ message: 'Account user not found.'});

	let requestLimit = 0;
	if(user?.isTrialActive) {
		requestLimit = user?.monthlyRequestCount;
	}

	// check if the user has exceeded his/her monthly request or not
	if(user?.apiRequestCount >= requestLimit) {
		throw new Error('API Request limit reached, please subscribe to a plan.')
	}
	next();
});

module.exports = checkAPiRequestLimit;