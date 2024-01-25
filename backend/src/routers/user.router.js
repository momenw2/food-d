import { Router } from "express";
import jwt from 'jsonwebtoken';
const router =Router();
import { BAD_REQUEST } from '../constants/httpStatus.js';
import handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.mid.js';
const PASSWORD_HASH_SALT_ROUNDS = 10;


router.post('/login', handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const tokenResponse = generateTokenResponse(user);
        // res.json(tokenResponse);
        res.json({ token: tokenResponse.token});
        

    } else {
        res.status(BAD_REQUEST).send('Username or password is invalid');
    }
}));






    router.post(
        '/register',
        handler(async (req, res) => {
            const { name, email, password, address, birthdate, phoneNumber, gender } = req.body;
            const user = await UserModel.findOne({ email });
        
            if (user) {
                res.status(BAD_REQUEST).send('User already exists, please login!');
                return;
            }
        
            const hashedPassword = await bcrypt.hash(
                password,
                PASSWORD_HASH_SALT_ROUNDS
            );
        
            const newUser = {
                name ,
                email: email.toLowerCase(),
                password: hashedPassword,
                address,
                birthdate,
                phoneNumber,
                gender,
            };
        
            const result = await UserModel.create(newUser);
            const token = generateTokenResponse(result);
        
            // Send only the token as a string in the response
            res.send({ token: token.token });
            })
        );

        router.put(
            '/updateProfile',
            auth,
            handler(async (req, res) => {
                const { name, address, phoneNumber, birthdate, gender} = req.body;
                const user = await UserModel.findByIdAndUpdate(
                    req.user.id,
                    { name, address, phoneNumber, birthdate, gender},
                    { new: true }
                );
            
                res.send(generateTokenResponse(user));
                })
            );

            router.put('/profile', auth, handler(async (req, res) => {
                const { fullName, address, phoneNumber, birthdate, gender } = req.body;
                const user = await UserModel.findByIdAndUpdate(
                    req.user.id,
                    { name: fullName, address, phoneNumber, birthdate, gender },
                    { new: true }
                );
            
                res.send({
                    fullName: user.name, 
                    address: user.address,
                    birthdate: user.birthdate,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                });
            }));
            
            
            
            router.put(
                '/changePassword',
                auth,
                handler(async (req, res) => {
                const { currentPassword, newPassword } = req.body;
                const user = await UserModel.findById(req.user.id);
            
                if (!user) {
                    res.status(BAD_REQUEST).send('Change Password Failed!');
                    return;
                }
            
                const equal = await bcrypt.compare(currentPassword, user.password);
            
                if (!equal) {
                    res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
                    return;
                }
            
                user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
                await user.save();
            
                res.send();
                })
            );

            router.get('/profile', auth, handler(async (req, res) => {
                try {

                    //return res.json("hello");
                    // Check if Authorization header is present
                    if (!req.headers.access_token) {
                        return res.status(UNAUTHORIZED).send('Access token missing');
                    }
            
                    // Extract and verify the token
                    //const token = req.headers.authorization.split(' ')[1];
                    const token = req.headers.access_token;
                    //return res.json(token);
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    //return res.json(decoded)
            
                    // Fetch user data from the database based on the decoded user ID
                    const user = await UserModel.findById(decoded.id);
            
                    if (!user) {
                        // Handle the case where the user is not found
                        return res.status(UNAUTHORIZED).send('User not found');
                    }
            
                    // Provide the user profile data in the response
                    res.json({
                        id: user.id,
                        email: user.email,
                        fullName: user.name,
                        address: user.address,
                        birthdate: user.birthdate,
                        phoneNumber: user.phoneNumber,
                        gender: user.gender,
                        token,
                        // Include other profile data as needed
                    });
                } catch (error) {
                    console.error('Authentication Error:', error);
            
                    if (error.name === 'TokenExpiredError') {
                        return res.status(UNAUTHORIZED).send('Access token has expired');
                    }
            
                    // Handle other token verification errors
                    res.status(UNAUTHORIZED).send('Authentication failed');
                }
            }));
            
            

        const generateTokenResponse = user => {
            const token = jwt.sign(
                {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET,
                {
                expiresIn: '30d',
                }
            );
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                address: user.address,
                isAdmin: user.isAdmin,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                birthdate: user.birthdate,
                token,
            };
        };

        export default router;