/* eslint-disable */

import express from 'express';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import dotenv from 'dotenv';

import 'colors';

import authRoute from './routes/auth.route.js';

import NotFoundError from './errors/not.found.error.js';
import errorHandlerMiddleware from './middlewares/error.handler.middleware.js';

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

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandlerMiddleware);

export default app;
