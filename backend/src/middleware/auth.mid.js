// import pkg from 'jsonwebtoken';
// const { verify } = pkg;
//     // import { verify } from 'jsonwebtoken';  
//     import { UNAUTHORIZED } from '../constants/httpStatus.js';

//     export default (req, res, next) => {
//     const token = req.headers.access_token;
//     if (!token) return res.status(UNAUTHORIZED).send();

//     try {
//         const decoded = verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//     } catch (error) {
//         res.status(UNAUTHORIZED).send();
//     }

//     return next();
//     };

import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../constants/httpStatus.js';

export default (req, res, next) => {
    console.log('Headers:', req.headers); // Add this line
    const token = req.headers.access_token;

    if (!token) {
        return res.status(UNAUTHORIZED).send('Access token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error during token verification:', error.message);
        res.status(UNAUTHORIZED).send('Invalid token');
    }
};

// import jwt from 'jsonwebtoken';
// import { UNAUTHORIZED } from '../constants/httpStatus.js';

// export default (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(UNAUTHORIZED).send('Access token missing or invalid');
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('Error during token verification:', error.message);
//         res.status(UNAUTHORIZED).send('Invalid token');
//     }
// };

