import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
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
    author: {
      type: mongoose.Schema.Types,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
