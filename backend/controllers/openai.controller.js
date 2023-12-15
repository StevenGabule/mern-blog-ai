const asyncHandler = require('express-async-handler');
const axios = require('axios');
const ContentHistory = require('../models/ContentHistory.model');
const User = require('../models/User.model');

const openAIController = asyncHandler(async(req, res) => {
	const {prompt} = req.body;
	try {
		const response = await axios.post(process.env.OPEN_AI_URL, {
			model: 'gpt-3.5-turbo-instruct',
			prompt,
			max_tokens: 700
		}, {
			headers: {
				Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
				'Content-Type': 'application/json'
			}
		})
		const content = response?.data?.choices[0].text?.trim();
		const newContent = await ContentHistory.create({user: req.user._id, content})

		const userFound = await User.findById(req.user.id);
		userFound.history.push(newContent?._id)
		userFound.apiRequestCount += 1;
		await userFound.save();
		
		res.json(content)
	} catch (error) {
		throw new Error(error)
	}
})

module.exports = {openAIController}