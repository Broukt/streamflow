const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Video = require("../models/videoModel");

const uploadVideo = catchAsync(async (req, res, next) => {
  const { title, description, genre } = req.body;
  if (!title || !description || !genre) {
    return next(new AppError("All fields are required", 400));
  }
  const video = await Video.create({
    title,
    description,
    genre,
    isActive: true,
  });
  res.status(201).json(video);
});

const getVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id).orFail(
    () => new AppError("Video not found", 404)
  );
  if (!video.isActive) {
    return next(new AppError("Video not found", 404));
  }
  res.status(200).json(video);
});

const updateVideo = catchAsync(async (req, res, next) => {
  const { title, description, genre } = req.body;
  if (!title || !description || !genre) {
    return next(new AppError("All fields are required", 400));
  }
  const video = await Video.findById(req.params.id);
  if (!video || !video.isActive) {
    return next(new AppError("Video not found", 404));
  }
  video.title = title;
  video.description = description;
  video.genre = genre;
  await video.save();
  res.status(200).json(video);
});

const deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video || !video.isActive) {
    return next(new AppError("Video not found", 404));
  }
  video.isActive = false;
  await video.save();
  res.status(204).send();
});

const getAllVideos = catchAsync(async (req, res, next) => {
  const { title, genre } = req.query;
  const filter = { isActive: true };
  if (title) filter.title = { $regex: title, $options: "i" };
  if (genre) filter.genre = { $regex: genre, $options: "i" };

  const videos = await Video.find(filter);
  if (videos.length === 0) {
    return next(new AppError("No videos found", 404));
  }
  res.status(200).json(videos);
});

module.exports = {
  uploadVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
};
