const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const auth = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlog);

// Protected endpoints
router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, blogController.updateBlog);
router.patch('/:id/publish', auth, blogController.publishBlog);
router.delete('/:id', auth, blogController.deleteBlog);
router.get('/user/blogs', auth, blogController.getUserBlogs);

module.exports = router;