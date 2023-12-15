const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const register = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		res.status(400);
		throw new Error('Please all fields are required.')
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('Email already used by other users. Please use another one.')
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = new User({
		username,
		password: hashedPassword,
		email
	})

	newUser.trialExpires = new Date(new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000)
	await newUser.save();

	res.json({
		status: true,
		message: 'Registration was successful.',
		user: {
			username,
			email
		}
	})

})

const login = asyncHandler(async(req, res) => {
	const errText = 'Invalid email or password.';
	const {email, password} = req.body;
	const user = await User.findOne({email})
	if(!user) {
		res.status(401);
		throw new Error(errText)
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if(!isMatch) {
		res.status(401);
		throw new Error(errText)
	}

	const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '3d'})
	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 24 * 60 * 60 * 1000 // 1d
	})

	res.json({
		status: 'success',
		message: 'Login success',
		_id: user._id,
		username: user.username,
		email: user.email
	})
})

const logout = asyncHandler(async(req, res) => {
	res.cookie('token', '', {maxAge: 1});
	res.status(200).json({message: 'Logged out successfully.'})
})

const userProfile = asyncHandler(async(req, res) => {
	const user = await User.findById(req.user.id).select('-password');
	if(!user) {
		res.status(401);
		throw new Error('Account not found.')
	}

	res.json({
		status: 'Success',
		user
	});
})

module.exports = {
	register,
	login,
	logout,
	userProfile
}