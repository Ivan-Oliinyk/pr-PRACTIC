const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  devtool: "source-map",

  devServer: {
    port: 9001,
    // open: true,

    static: {
      directory: __dirname,
    },
  },
};
