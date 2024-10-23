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
      required: [true, 'A comment must belong to a post'],
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to an author'],
    },
  },
  { timestamps: true },
);

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
