/* eslint-disable */

import helmet from 'helmet';
import hpp from 'hpp';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';

import 'colors';

import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

import { NotFoundError } from './errors/not.found.error.js';
import errorHandler from './middlewares/error.handler.middleware.js';

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());
app.options('*', cors());

app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 2500,
  windowMs: 15 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in 15 minutes',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(hpp());

app.use(xss());

app.use(compression);

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

export default app;
