import express from 'express';
import {
  getMe,
  getUsers,
  postLogin,
  postUser,
  getUserById,
  putUserById,
  deleteUserById
} from '../controllers/user-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';

const userRouter = express.Router();

// Users resource endpoints
userRouter.route('/')
// GET all users
.get(getUsers)
// POST new user
.post(postUser);

// POST user login
userRouter.post('/login', postLogin);

// Get user info based on token
userRouter.get('/me', authenticateToken, getMe);


// TODO: get user by id
// app.get('/api/users/:id');
// TODO: put user by id
// TODO: delete user by id
// User by id endpoints
userRouter.route('/:id')
  .get(getUserById)      // GET /api/users/:id
  .put(putUserById)      // PUT /api/users/:id
  .delete(deleteUserById); // DELETE /api/users/:id

export default userRouter;


// ChatGPT:tä hyödynnettiin:
// - Reittien jakamisessa omiin router-tiedostoihin
// - RESTful-rakenteen (/api/users, /api/users/:id) toteutuksessa
// - route('/')-ketjutuksen ymmärtämisessä