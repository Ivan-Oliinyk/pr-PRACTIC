const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  //проверяем метод запроса если он равен "OPTIONS" ты вызываем следуующий по цепочке мидлвар
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    //получаем токен из заголовка
    //так мы получаем стироку из двух значений то переводим ее в массив и получаем 2 значание  которое и будет наш токен
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZWYxN2RmNzgyOThmNTRjOGUxYmEyMCIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTY0MzE5NzM3NCwiZXhwIjoxNjQzMjgzNzc0fQ.Ito4N0S-A16LQsX2r6Yjulw6lQUbFu6wkCAseRTjdpU
    const token = req.headers.authorization.split(" ")[1];

    //если токена нет то опять возвращаем ошибку
    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
    //если токен есть то нам нужно его декодировать
    const decodedData = jwt.verify(token, secret);

    //для того чтобы мы эти данные могли использывать внутри других функций в запросе создаем новое поле user и туда добавляем эти данные
    req.user = decodedData;

    //вконце вызываем функцию  next() что бы вызвать по цепочки следующий мидлвар
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
};
