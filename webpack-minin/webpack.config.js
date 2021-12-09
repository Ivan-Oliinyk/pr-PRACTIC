const path = require("path"); //модуль node.js для работы с путями
const HTMLWebpackPlagin = require("html-webpack-plugin"); // подключаем плагин
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // подключаем плагин для очистки дист

module.exports = {
  context: path.resolve(__dirname, "src"), //указываем папку контекст с которой будет работать webpack
  //mode: "development", //мод для билда по умолчанию production это настройку лучше установить в скрипты package.json

  entry: {
    main: "./index.js", //точка входа 1
    analitics: "./analityc.js", //точка входа 2
  },

  output: {
    // filename: "[name].bandle.js ==> файлы будут по типу "имя из точки".bandle.js
    filename: "[name].[contenthash].js", //файлы будут по типу "имя из точки".ХЕШ.js при этом при кажой сборке если файл изменился то будет создаваться новый образец с новым хешем
    path: path.resolve(__dirname, "dist"), //папка куда будет собираться файлы
  },

  resolve: {
    // extensions: ["js", ".json", ".png"], // устанавливает раширения по умолчанию можно теперь при импоре их не ставить ВАЖНО!==== названия не должны совпадать
    alias: {
      "@models": path.resolve(__dirname, "src/models/"),
      "@": path.resolve(__dirname, "src/"),
    },
  },

  //для оптимизации работы с библиотеками
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  //плагины храняться в массиве, добавляются только через new ИМЯ ПЛАГИНА()
  plugins: [
    new HTMLWebpackPlagin({
      //title: "Webpack Minin", // настройки тайтла странице при билде подставиться в тег title в хедере html НЕ РАБОТАЕТ ЕСЛИ УКАЗАН template
      template: "./index.html", //указываем путь именно до этого html
    }),

    new CleanWebpackPlugin(),
  ],

  devServer: {
    port: 8888,
  }

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"], //порядок чтения в вебпаке справа налево
      },

      {
        test: /\.(png|jpg|svg|gif)$/, // будет искать файлы с данным расширением
        // use: ["asset/resource"], // указываем не работатет в 5вебпаке
        type: "asset/resource", //для 5 вебпака
      },

      {
        test: /\.(woff(2)?|ttf|woff|eot|otf)$/,
        // use: ["file-loader"],
        type: "asset/inline",
      },

      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },

      {
        test: /\.csv$/,
        use: ["csv-loader"],
      },
    ],
  },
};
