const express = require("express");
// const { restrictTo } = require("../../middlewares/authMiddleware");
const router = express.Router();
const {
  uploadVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
} = require("../controllers/videoController");

// const { protect, restrictTo } = require('../../authModule/middleware/authMiddleware');

// router.use(protect);

// Listar y crear videos
router.route("/").get(getAllVideos).post(uploadVideo);

router
  .route("/:id")
  .get(getVideo)
  .patch(updateVideo)
  .delete(deleteVideo);

module.exports = router;
