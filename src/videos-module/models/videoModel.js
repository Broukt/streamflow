const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const VideoSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    title: {
      type: String,
      required: [true, 'The title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'The description is required'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'The genre is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Video', VideoSchema);