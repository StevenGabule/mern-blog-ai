const express = require('express');
const { register, login, logout, userProfile } = require('../controllers/user.controller');
const isAuthenticated = require('../middleware/isAuthenticated.middleware');

const usersRouter = express.Router();

usersRouter.post('/register', register);
usersRouter.post('/login', login);
usersRouter.post('/logout', logout);
usersRouter.post('/profile/:id', isAuthenticated, userProfile);

module.exports = usersRouter;