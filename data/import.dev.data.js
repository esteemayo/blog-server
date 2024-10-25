import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import 'colors';

import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Category from '../models/category.model.js';
import Comment from '../models/comment.model.js';
import ReplyComment from '../models/reply.comment.model.js';

import connectDB from '../config/db.config.js';

dotenv.config({ path: './config.env' });

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'),
);
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/comments.json`, 'utf-8'),
);
const replies = JSON.parse(
  fs.readFileSync(`${__dirname}/replies.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Comment.insertMany(comments);
    await Post.insertMany(posts);
    await Category.insertMany(categories);
    await User.insertMany(users);
    await ReplyComment.insertMany(replies);

    console.log(
      '👍👍👍👍👍👍👍👍 Data successfully loaded! 👍👍👍👍👍👍👍👍'.green.bold,
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    console.log('😢😢 Goodbye Data...');

    await Comment.deleteMany();
    await Post.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await ReplyComment.deleteMany();

    console.log(
      'Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n'
        .blue.bold,
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
