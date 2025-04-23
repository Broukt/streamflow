const express = require("express");
const { restrictTo, protect } = require("../../middlewares/authMiddleware");
const router = express.Router();
const {
  uploadVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
} = require("../controllers/videoController");

router.get('/', getAllVideos)

router.use(protect);

router.post('/', restrictTo('Administrador'), uploadVideo);

router
  .route("/:id")
  .get(getVideo)
  .patch(restrictTo('Administrador'), updateVideo)
  .delete(restrictTo('Administrador'), deleteVideo);

module.exports = router;
