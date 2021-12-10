const express = require("express");
const app = express();

app.use("/", function (req, res) {
  console.log("Cookies from client", req.headers["cookie"]);
  // res.setHeader("Set-Cookie", "TestHeader=HeaderValue");

  res.setHeader("Set-Cookie", ["item3=value3", "item=value4"]);

  console.log("Method getCookie(): ", res.getHeader("Set-Cookie"));
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
  console.log(`Server is start on port 8080 !!!!!!!!`);
});
