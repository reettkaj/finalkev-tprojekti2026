import fetch, { Headers } from 'node-fetch';
// import { customError } from '../middlewares/error-handler.js';
import { insertKubiosResults, fetchKubiosDataForUser } from '../models/kubios-model.js';

const baseUrl = process.env.KUBIOS_API_URI;

/**
 * Helper: build ISO date safely
 */
const buildFromDate = (queryFrom) => {
  if (queryFrom) {
    const date = new Date(queryFrom);
    if (isNaN(date)) {
      throw new Error('Invalid "from" date');
    }
    return date.toISOString();
  }

  // järkevä default (ei kovakoodattu vuosi)
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString();
};

/**
 * Get user data from Kubios API
 */
const getUserData = async (req, res, next) => {
  try {
    const { kubiosIdToken, userId } = req.user;

    if (!kubiosIdToken) {
      return next({
        status: 401,
        message: 'Missing Kubios token',
      });
    }

    const fromDate = buildFromDate(req.query.from);

    const headers = new Headers({
      'User-Agent': process.env.KUBIOS_USER_AGENT,
      Authorization: `Bearer ${kubiosIdToken}`,
    });

    const url = `${baseUrl}/result/self?from=${encodeURIComponent(fromDate)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();

      return next({
        status: response.status,
        message: 'Kubios API error',
        details: errorText,
      });
    }

    const data = await response.json();

    if (!data?.results) {
      return next({
        status: 502,
        message: 'Invalid response from Kubios API (missing results)',
      });
    }

    // Tallenna DB:hen
    await insertKubiosResults(userId, data.results);

    return res.json(data);

  } catch (error) {
    console.error('getUserData ERROR:', error);

    return next({
      status: 500,
      message: 'Failed to fetch Kubios data',
      details: error.message,
    });
  }
};

/**
 * Get user info from Kubios API
 */
const getUserInfo = async (req, res, next) => {
  try {
    const { kubiosIdToken } = req.user;

    if (!kubiosIdToken) {
      return next({
        status: 401,
        message: 'Missing Kubios token',
      });
    }

    const headers = new Headers({
      'User-Agent': process.env.KUBIOS_USER_AGENT,
      Authorization: `Bearer ${kubiosIdToken}`, // korjattu
    });

    const response = await fetch(`${baseUrl}/user/self`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();

      return next({
        status: response.status,
        message: 'Kubios API error',
        details: errorText,
      });
    }

    const userInfo = await response.json();

    return res.json(userInfo);

  } catch (error) {
    console.error('getUserInfo ERROR:', error);

    return next({
      status: 500,
      message: 'Failed to fetch Kubios user info',
      details: error.message,
    });
  }
};

const getKubiosDataByUserId = async (req, res) => {

  const userId = req.params.id;

  try {

    const data =
      await fetchKubiosDataForUser(userId);

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Kubios data fetch failed"
    });
  }
};

export { getUserData, getUserInfo, getKubiosDataByUserId };