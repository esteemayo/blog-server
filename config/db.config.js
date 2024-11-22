/* eslint-disable */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env ' });

const devEnv = process.env.NODE_ENV !== 'production';
const { DATABASE, DATABASE_PASSWORD, DATABASE_LOCAL } = process.env;

const dbLocal = DATABASE_LOCAL;
const mongoURI = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

const connectionStr = devEnv ? dbLocal : mongoURI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connectionStr);
    console.log(`Connected to Database → ${conn.connection.port}`.gray.bold);
  } catch (err) {
    throw err;
  }
};

mongoose.set('strictQuery', false);

const db = mongoose.connection;

db.on('disconnected', () => {
  console.log('Disconnected from Database'.strikethrough);
});

db.on('error', (err) => {
  console.log(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB'.random.bold);
});

export default connectDB;
