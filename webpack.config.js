const path = require("path");

module.exports = {
  entry: ["./src/opened.js", "./src/perDay.js", "./src/stats.js"],
  watch: true,
  watchOptions: {
    aggregateTimeout: 20,
    poll: 1000,
    ignored: "**/node_modules",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
};
