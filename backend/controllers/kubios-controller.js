import fetch from 'node-fetch';
 // import {customError} from '../middlewares/error-handler.js';

import { insertKubiosResults } from '../models/kubios-model.js';

 // Kubios API base URL should be set in .env
 const baseUrl = process.env.KUBIOS_API_URI;

 /**
 * Get user data from Kubios API example
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */



const getUserData = async (req, res, next) => {
  try {
    const {kubiosIdToken, userId} = req.user;

    if (!kubiosIdToken) {
      return res.status(401).json({error: 'No Kubios token'});
    }

    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
    headers.append('Authorization', `Bearer ${kubiosIdToken}`); // 🔥 tärkeä

    const response = await fetch(
      `${baseUrl}/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00`,
      { method: 'GET', headers }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Kubios API error:', text);
      return res.status(response.status).json({ error: text });
    }

    const results = await response.json();

    console.log('Kubios results:', results);

    if (!results.results) {
      return res.status(500).json({ error: 'No results field from Kubios' });
    }

    await insertKubiosResults(userId, results.results);

    return res.json(results);

  } catch (error) {
    console.error('getUserData ERROR:', error);
    return res.status(500).json({ error: error.message });
  }
};


     // TODO: set the from date more sophisticated way
     // in this example, data from 1.1.2024 is requested and hardcoded in the URL,
     // but it should be dynamic based on for example request parameters or some other date handling logic


   // Kubiokselta saatua dataa voi käsitellä (palvelipuolella) tässä
   // ennen responsen lähettämistä client-sovellukselle

 /**
 * Get user info from Kubios API example
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserInfo = async (req, res, next) => {
   const {kubiosIdToken, userId} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(baseUrl + '/user/self', {
     method: 'GET',
     headers: headers,
   });
   const userInfo = await response.json();
   return res.json(userInfo);
 };

 export {getUserData, getUserInfo};
