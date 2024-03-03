/// <reference types="../types.d.ts" />

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import { User } from '../db/models';
import { authMiddleware } from './middleware';
import LogRoute from '../utils/decorators';

class UserController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getUsers.bind(this));
    this.router.post('/register', this.registerUser.bind(this));
    this.router.post('/login', this.loginUser.bind(this));
    this.router.put('/:id', authMiddleware, this.updateUser.bind(this));
    this.router.get('/role', authMiddleware, this.getRole.bind(this));
  }

  @LogRoute('HTTP Request')
  async getUsers(req: Request, res: Response) {
    const users = await User.find();
    return res.json(users);
  }

  @LogRoute('HTTP Request')
  async registerUser(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
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
    } catch (err: any) {
      console.log(err)
      return res.status(500).send('Error registering new user');
    }
  }

  @LogRoute('HTTP Request')
  async loginUser(req: Request, res: Response) {
    try {
      const SECRET_KEY = process.env.SECRET_KEY || 'generic';
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
      const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);

      return res.status(200).send({ token });
    } catch (err: any) {
      return res.status(500).send('Internal server error');
    }
  }

  @LogRoute('HTTP Request')
  async updateUser(req: Request, res: Response) {
    try {
      const {id} = req.params;
      if (id && req.user.role !== 'admin') {
        
      }
    } catch (err: any) {
      console.error(err.message)
    }
  }

  @LogRoute('HTTP Request')
  async getRole(req: Request,res: Response) {
    try {
        const role = req.user.role
        return res.status(200).json({role});
    } catch (err: any) {
      console.error(err.message)
      return res.status(500)
    }
  }
}

const userController = new UserController();
export default userController.router;
