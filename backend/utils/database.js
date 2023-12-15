const mongoose = require('mongoose')

const connectDB = async() => {
	try {
		const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mern_blog_ai_db');
		console.log(`MongoDB connected ${conn.connection.host}`);
	} catch (error) {
		console.log(`Error connecting to MongoDB ${error.message}`);
		process.exit(1)
	}
}

module.exports = connectDB;