const Blog = require("../model/blog");
const createError = require("http-errors");
const calculateReadingTime = require("../utils/readingTime");
const {
  buildQuery,
  buildSort,
  getPagination,
} = require("../utils/queryHelpers");

// Get all published blogs (paginated, filterable, searchable, orderable)
const getBlogs = async (req, res, next) => {
  try {
    const filter = buildQuery(req.query);
    const sort = buildSort(req.query);
    const { limit, skip, page } = getPagination(req.query);
    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "-password");
    const total = await Blog.countDocuments(filter);
    if (total < 1) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message:
          "No blogs have been published yet. Be the first to create one!",
        page,
        total: 0,
        blogs: [],
      });
    }
     res.status(200).json({
      success: true,
      statusCode: 200,
      page,
      total,
      blogs,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single published blog (increments read_count, returns author info)
const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      state: "published",
    }).populate("author", "-password");
    if (!blog) {
      return next(
        createError(
          404,
          "Sorry, we couldn't find the blog you are looking for. It may have been deleted or is not published yet."
        )
      );
    }
    blog.read_count += 1;
    await blog.save();
    res.status(200).json({ success: true, statusCode: 200, blog });
  } catch (err) {
    next(err);
  }
};

// Create a blog (draft, logged-in only)
const createBlog = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;
    if (!title || !body) {
      return next(createError(400, "Title and body are required"));
    }

    const existingTitle = await Blog.findOne({ title });
    if (existingTitle) {
      return next(
        createError(409, "Title already exists, please use a different title.")
      );
    }
    const reading_time = calculateReadingTime(body);
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.user._id,
      reading_time,
    });
    await blog.save();
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// Update a blog (owner only)
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return next(
        createError(
          404,
          "Sorry, we couldn't find the blog you want to update. It may have been deleted or never existed."
        )
      );
    if (blog.author.toString() !== req.user._id.toString())
      return next(
        createError(
          403,
          "You do not have permission to update this blog. Only the blog owner can make changes."
        )
      );
    const { title, description, tags, body } = req.body;
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }
    await blog.save();
    res.json({
      success: true,
      statusCode: 200,
      message: "Blog updated successfully!",
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// Publish a blog (owner only)
const publishBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(
        createError(
          404,
          "We couldn't find the blog you want to publish. It may have been deleted or never existed"
        )
      );
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return next(
        createError(
          403,
          "You can only publish your own blogs. Please make sure you're the owner of this blog."
        )
      );
    }

    if (blog.state === "published") {
      return next(createError(400, "This blog is already published!"));
    }

    blog.state = "published";
    await blog.save();
    res.json({
      success: true,
      message: "Your blog has been published successfully!",
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a blog (owner only)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(
        createError(
          404,
          "Sorry, we couldn't find the blog you want to delete. It may have already been removed or never existed."
        )
      );
    }
    if (blog.author.toString() !== req.user._id.toString()) {
      return next(
        createError(
          403,
          "You do not have permission to delete this blog. Only the blog owner can delete it."
        )
      );
    }

    await blog.deleteOne();
    res.json({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Get a list of the user's blogs (paginated, filterable by state)
const getUserBlogs = async (req, res, next) => {
  try {
    const filter = buildQuery(req.query);
    filter.author = req.user._id;
    const sort = buildSort(req.query);
    const { limit, skip, page } = getPagination(req.query);
    const blogs = await Blog.find(filter).sort(sort).skip(skip).limit(limit);
    const total = await Blog.countDocuments(filter);
    if (total < 1) {
      // Check if user has any blogs at all (ignoring state)
      const anyBlogs = await Blog.countDocuments({ author: req.user._id });
      if (anyBlogs > 0) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "You have created blogs, but none are published yet. Publish a blog to make it visible here.",
          page,
          total: 0,
          blogs: [],
        });
      } else {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "You haven't created any blogs yet. Start writing your first blog!",
          page,
          total: 0,
          blogs: [],
        });
      }
    }
    res.status(200).json({
      success:true,
      statusCode:200,
      page,
      total,
      blogs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlog,
  getBlogs,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
  getUserBlogs,
};
