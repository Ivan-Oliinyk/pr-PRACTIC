const http = require("http");
const Cookies = require("cookies");

http
  .createServer(function (req, res) {
    const cookies = new Cookies(req, res, { keys: ["secret_string"] });

    console.log(cookies.get("login", { signed: true }));

    const cookieOptions = {
      maxAge: 12000,
      path: "/admin",
      secure: false,
      signed: true,
    };

    cookies.set("login", "test@ex.com", cookieOptions);

    res.end();
  })
  .listen(8080, function () {
    console.log("server start on port ", 8080);
  });
