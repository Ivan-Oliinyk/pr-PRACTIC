import React from "react";
import ReactDOM from "react-dom";
import "modern-normalize/modern-normalize.css";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector("#root")
);

// const elem1 = React.createElement('section', {children: 'i am span 1'})
// const elem2 = React.createElement('div', {children: 'i am span 2'})
// const elem3 = React.createElement('p', {children: ' '})
// const elem4 = React.createElement('h1', {children: 'Hello world'})
// const jsxElem1 = <section>'I am section'</section>;
// const jsxElem2 = <div>'I am div'</div>;
// const jsxElem3 = <p>'this is p'</p>;
// const jsxElem4 = <h1>'this is title h1'</h1>;

// const element1 = React.createElement(
//   'div',
//   {
//     a: 5,
//     b: 6,
//     // children: "hello world"
//     // children: [elem1, elem2, elem3, elem4],
//     children: [jsxElem1, jsxElem2, jsxElem3, jsxElem4],
//   }
// )

// const jsxElement1 = (
//   <div>
//     {jsxElem1} {jsxElem2}
//     {jsxElem3}
//     {jsxElem4} {10 + 11} {"banzay"}
//   </div>
// );

// const jsxElement = <div>'Hello world'</div>

// console.log(element1)
// console.log(jsxElement);
// console.log(jsxElement1);

// ReactDOM.render(jsxElement1, document.querySelector('#root'))

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

//Компоненты
// const data = {
//   id: 'id-1',
//   url: "https://static.boredpanda.com/blog/wp-content/uploads/2014/01/animal-children-photography-elena-shumilova-2.jpg",
//   title: 'Pictures',
//   price: '505',
//   autor: {
//     tag: "soame",
//     url: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2019/07/Man-Silhouette.jpg"
//   },
//   quantity: 10
// }
// const data = dataPainting[0]

// const data = dataPainting[1];
// console.log(painting);

// (
//   <Painting
//     id={data.id}
//     url={data.url}
//     title={data.title}
//     price={data.price}
//     tag={data.author.tag}
//     urlAutor={data.author.url}
//     quantity={data.quantity}
//   />
// ),
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.querySelector("#root")
// );

// ReactDOM.render(jsxElement1, document.querySelector('#root'))
