const userRouter = express.Router();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../db/models';
import { authMiddleware } from './middleware';

userRouter.get('/',async (req, res) => {
    const users = await User.find();
    return res.json(users);
});


userRouter.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser){
            return res.status(400).send('User already exists');
        }
        const user = new User({
            email: email,
            name: firstName + ' ' + lastName,
            password: password,
            role: 'user',
            socials: []
        });
        await user.save();
        return res.status(201).send('User registered successfully');
    } catch (error) {
        console.log(error)
       return res.status(500).send('Error registering new user');
    }
});

userRouter.post('/login', async (req,res)=>{
    try {
        const SECRET_KEY = process.env.SECRET_KEY || 'generic';
        const REFRESH_SECRET = process.env.REFRESH_SECRET || 'generic_refresh';
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User does not exist');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Wrong password');
        }

        // Access token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '7d' });

        return res.status(200).send({ token });
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
})

module.exports = userRouter; 