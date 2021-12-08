import "./scss/common.scss";
// import "./scss/main.scss";

console.log("sdasdassadd2");
console.log(2);

// создаем элемент заголовка
const heading = document.createElement("h1");
heading.textContent = "Как интересно 223!";

// добавляем заголовок в DOM
const root = document.querySelector("#root");
root.append(heading);

console.log([1, 2, 3].map((n) => n + 1));
