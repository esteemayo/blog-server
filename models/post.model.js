import slugify from 'slugify';
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
      required: [true, 'A post must have an author'],
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true },
);

postSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  this.slug = slugify(this.title, { lower: true, trim: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const postWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (postWithSlug.length) {
    this.slug = `${this.slug}-${postWithSlug.length + 1}`;
  }
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
