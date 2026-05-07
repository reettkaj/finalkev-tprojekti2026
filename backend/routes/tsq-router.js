import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {getTsq,postTsq,getTsqById} from '../controllers/tsq-controller.js'

const tsqRouter = express.Router();

tsqRouter.route('/')

.post(authenticateToken, postTsq);

tsqRouter.route('/:id')

.get(
    //authenticateToken, 
    getTsqById);

tsqRouter.route('/user/:id')

.get(authenticateToken, getTsq);

export default tsqRouter;