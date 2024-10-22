import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    likes: {
      type: [String],
    },
    dislikes: {
      type: [String],
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
