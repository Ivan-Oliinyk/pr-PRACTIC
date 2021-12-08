const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },

  stats: "errors-only",
  // mode: "development",
  devtool: "source-map",

  devServer: {
    port: 9001,
    open: true,
    // liveReload: true,

    static: {
      directory: path.resolve(__dirname, "dist"),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack Boilerplate",
      template: path.resolve(__dirname, "/src/template.html"), // шаблон
      filename: "index.html", // название выходного файла
      inject: "body",
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
};
