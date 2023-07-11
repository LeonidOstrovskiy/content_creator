import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import router from './route.js';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());
//app.use(bodyParser.json({ limit: '30mb', extended: true }));
//app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json());

app.use('/openai', router);

const port = process.env.PORT || 8000;

const start = async () => {
  app.listen(port, () => console.log(`server on port ${port}`));
};

start();
