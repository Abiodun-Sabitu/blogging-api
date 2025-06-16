// Calculates reading time based on 200 words per minute
module.exports = function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};