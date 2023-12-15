require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users.routes');
const openAIRouter = require('./routes/openai.routes');
const { errorHandler } = require('./middleware/error.middleware');
const stripeRouter = require('./routes/stripe.routes');

require('./utils/database')();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser)

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/openai', openAIRouter);
app.use('/api/v1/stripe', stripeRouter);

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))