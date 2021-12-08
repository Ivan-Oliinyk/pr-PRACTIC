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

  //плагины храняться в массиве, добавляются только через new ИМЯ ПЛАГИНА()
  plugins: [
    new HTMLWebpackPlagin({
      //title: "Webpack Minin", // настройки тайтла странице при билде подставиться в тег title в хедере html НЕ РАБОТАЕТ ЕСЛИ УКАЗАН template
      template: "./index.html", //указываем путь именно до этого html
    }),

    new CleanWebpackPlugin(),
  ],
};
