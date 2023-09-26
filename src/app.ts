import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import * as dotenv from 'dotenv'
import * as routes from './routes/index';

const app = express();
dotenv.config();

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.initRoutes(app);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  return console.log(`Backend server ( ${process.env.NODE_ENV} ) is listening at http://localhost:${port}`);
});