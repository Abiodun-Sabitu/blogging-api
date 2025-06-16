// Helper for pagination, filtering, searching, and ordering
exports.buildQuery = (query) => {
  const filter = { state: 'published' };
  if (query.state) filter.state = query.state;
  if (query.author) filter.author = query.author;
  if (query.title) filter.title = { $regex: query.title, $options: 'i' };
  if (query.tags) filter.tags = { $in: query.tags.split(',') };
  return filter;
};

exports.buildSort = (query) => {
  const sort = {};
  if (query.orderBy) {
    const fields = ['read_count', 'reading_time', 'createdAt'];
    if (fields.includes(query.orderBy)) {
      sort[query.orderBy] = query.order === 'asc' ? 1 : -1;
    }
  } else {
    sort.createdAt = -1;
  }
  return sort;
};

exports.getPagination = (query) => {
  const page = parseInt(query.page) > 0 ? parseInt(query.page) : 1;
  const limit = parseInt(query.limit) > 0 ? parseInt(query.limit) : 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};