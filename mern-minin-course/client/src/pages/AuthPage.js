import React, { useState } from "react";

const AuthPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="row">
      <h1>Auth page</h1>
      <div className="col s6 offset-s3">
        <h1>Сократи ссылку</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>
              <div className="input-field">
                <input id="email" type="email" name="email" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input id="password" type="password" name="password" />
                <label htmlFor="password">Enter password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              style={{ marginRight: "10px" }}
              onChange={changeHandler}
            >
              Войти
            </button>
            <button
              className="btn grey lighten-1 black-text"
              onChange={changeHandler}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
