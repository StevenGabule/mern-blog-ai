const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated.middleware');
const { openAIController } = require('../controllers/openai.controller');
const checkAPiRequestLimit = require('../middleware/checkAPiRequestLimit.middleware');

const openAIRouter = express.Router();

openAIRouter.post('/generate-content', isAuthenticated, checkAPiRequestLimit, openAIController);

module.exports = openAIRouter;