import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import docsRouter from './swagger';
import dbConnect from './db/connection';
import { userRouter, eventRouter } from './routes';

const app = express();
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
})); // TODO: SPECIFY ORIGINS
app.use(bodyParser.json);
app.use('/explorer', docsRouter)
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use((req, res) => {
    res.status(404).send('Page not found');
  });
app.set('view engine', 'ejs');
dotenv.config();
dbConnect()

const APP_PORT = Number(process.env.PORT) || 4500;
const APP_IP = process.env.IP || '127.0.0.1';

app.listen(APP_PORT, APP_IP, function () {
    return console.log('\x1b[36m%s\x1b[0m',"Impact backend running " + APP_IP + ":" + APP_PORT + '\u001b[0m');
});

app.get('/', (req, res) => {
    try {
        console.log("loading page");
        return res.render('index.ejs');
    } catch (err) {
        console.error(err.message);
    }
});