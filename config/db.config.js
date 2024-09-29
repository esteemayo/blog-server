/* eslint-disable */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env ' });

const devEnv = process.env.NODE_ENV !== 'production';
const { DATABASE, DATABASE_PASSWORD, DATABASE_LOCAL } = process.env;

const dbLocal = DATABASE_LOCAL;
const mongoURI = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

const db = devEnv ? dbLocal : mongoURI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db);
    console.log(`Connected to Database → ${conn.connection.port}`.gray.bold);
  } catch (err) {
    throw err;
  }
};

mongoose.set('strictQuery', false);

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from Database'.strikethrough);
});

export default connectDB;
