import mongoose from 'mongoose';

const { Types, Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    post: {
      type: Types.ObjectId,
      ref: 'Post',
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
