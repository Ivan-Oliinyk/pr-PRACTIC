const http = require("http");
const Cookies = require("cookies");

http
  .createServer(function (req, res) {
    const cookies = new Cookies(req, res);

    if (req.url == "./favicon.ico") {
      res.end();
      return;
    }

    cookies.set("admin", true);

    console.log(cookies.get("admin"));

    res.end();
  })
  .listen(8080, function () {
    console.log("server start on port ", 8080);
  });
