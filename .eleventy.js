module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("shared");
  eleventyConfig.addPassthroughCopy({"src/**/*.css": null});
  eleventyConfig.addPassthroughCopy({"src/**/*.js": null});
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  };
};
