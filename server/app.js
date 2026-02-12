import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import httpStatus from 'http-status';
import { config } from './config/env.js';
import routes from './routes/index.js';
import ApiError from './utils/ApiError.js';
import { errorConverter, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (config.env !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(httpStatus.OK).json({ status: 'ok' });
});

app.use('/api', routes);


app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
