import React from "react";

const TodoItem = ({ complited, text, onComplited, onDelete }) => {
  return (
    <li className="Todo__item">
      <p className={complited ? "comlited" : ""}>{text}</p>
      <div className="Btn__wrapper">
        <button onClick={onComplited} className="btn__complited" type="button">
          Complited
        </button>
        <button onClick={onDelete} className="btn__delete" type="button">
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
