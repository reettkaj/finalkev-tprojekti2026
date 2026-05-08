import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {getUserData, getUserInfo, getKubiosDataByUserId} from '../controllers/kubios-controller.js';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/user-data', authenticateToken, getUserData)
  .get('/user-info', authenticateToken, getUserInfo);

  kubiosRouter.get(
  "/user-data/:id",
  authenticateToken,
  getKubiosDataByUserId
);

export default kubiosRouter;
