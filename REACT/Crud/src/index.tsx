import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UsersContext from './contexts/UsersContext';
import PostsContext from './contexts/PostsContext';

ReactDOM.render(
  <React.StrictMode>
    <UsersContext>
      <PostsContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PostsContext>
    </UsersContext>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
