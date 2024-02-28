import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import docsRouter from './swagger';
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use('/explorer', docsRouter)
app.set('view engine', 'ejs');
dotenv.config();

const APP_PORT = Number(process.env.PORT) || 4500;
const APP_IP = process.env.IP || '127.0.0.1';

app.listen(APP_PORT, APP_IP, function () {
    return console.log('\x1b[32m%s\x1b[0m',"Impact backend running " + APP_IP + ":" + APP_PORT + '\u001b[0m');
});

app.get('/', (req, res) => {
    return res.render('index.ejs');
});