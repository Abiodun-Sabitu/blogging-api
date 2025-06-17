const express = require("express");
const router = express.Router();
const {
  getBlog,
  getBlogs,
  getUserBlogs,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
} = require("../controller/blogController");
const auth = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getBlogs);
router.get("/:id", getBlog);

// Protected endpoints
router.post("/", auth, createBlog);
router.put("/:id", auth, updateBlog);
router.patch("/:id/publish", auth, publishBlog);
router.delete("/:id", auth, deleteBlog);
router.get("/user/blogs", auth, getUserBlogs);

module.exports = router;
