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
    this.router.put('/', authMiddleware, this.updateUser.bind(this));
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
    } catch (err: any) {
      return res.status(500).send('Internal server error');
    }
  }

  @LogRoute('HTTP Request')
  async updateUser(req: Request, res: Response) {
    try {
      // Your update logic here
    } catch (err: any) {
      console.error(err.message)
    }
  }
}

const userController = new UserController();
export default userController.router;
