import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {getTsq,postTsq,getTsqById} from '../controllers/tsq-controller.js'

const tsqRouter = express.Router();

tsqRouter.route('/')

.get(authenticateToken, getTsq)

.post(authenticateToken, postTsq);

tsqRouter.route('/:id')

.get(authenticateToken, getTsqById);

export default tsqRouter;