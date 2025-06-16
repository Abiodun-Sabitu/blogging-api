const Blog = require('../model/blog');
const User = require('../model/user');
const createError = require('http-errors');
const calculateReadingTime = require('../utils/readingTime');
const { buildQuery, buildSort, getPagination } = require('../utils/queryHelpers');

// Get all published blogs (paginated, filterable, searchable, orderable)
exports.getBlogs = async (req, res, next) => {
  try {
    const filter = buildQuery(req.query);
    const sort = buildSort(req.query);
    const { limit, skip, page } = getPagination(req.query);
    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', '-password');
    const total = await Blog.countDocuments(filter);
    res.json({
      page,
      total,
      blogs
    });
  } catch (err) {
    next(err);
  }
};

// Get a single published blog (increments read_count, returns author info)
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, state: 'published' }).populate('author', '-password');
    if (!blog) return next(createError(404, 'Blog not found'));
    blog.read_count += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Create a blog (draft, logged-in only)
exports.createBlog = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;
    if (!title || !body) return next(createError(400, 'Title and body are required'));
    const reading_time = calculateReadingTime(body);
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.user._id,
      reading_time
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// Update a blog (owner only)
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(createError(404, 'Blog not found'));
    if (blog.author.toString() !== req.user._id.toString()) return next(createError(403, 'Forbidden'));
    const { title, description, tags, body } = req.body;
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }
    await blog.save();
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Publish a blog (owner only)
exports.publishBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(createError(404, 'Blog not found'));
    if (blog.author.toString() !== req.user._id.toString()) return next(createError(403, 'Forbidden'));
    blog.state = 'published';
    await blog.save();
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Delete a blog (owner only)
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(createError(404, 'Blog not found'));
    if (blog.author.toString() !== req.user._id.toString()) return next(createError(403, 'Forbidden'));
    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
};

// Get a list of the user's blogs (paginated, filterable by state)
exports.getUserBlogs = async (req, res, next) => {
  try {
    const filter = buildQuery(req.query);
    filter.author = req.user._id;
    const sort = buildSort(req.query);
    const { limit, skip, page } = getPagination(req.query);
    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Blog.countDocuments(filter);
    res.json({
      page,
      total,
      blogs
    });
  } catch (err) {
    next(err);
  }
};