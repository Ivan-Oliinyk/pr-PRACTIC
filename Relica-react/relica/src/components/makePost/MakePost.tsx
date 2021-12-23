import React from "react";

type Value = {
  cb: () => void;
};

export const MakePost: React.FC<Value> = ({ cb }) => {
  const images = [
    "./images/posts/Component 96 – 1@2x.png",
    "./images/posts/Component 95 – 2@2x.png",
    "./images/posts/Component 95 – 2@2x.png",
    "./images/posts/Component 95 – 2@2x.png",
    "./images/posts/Component 95 – 2@2x.png",
    "./images/posts/Component 95 – 2@2x.png",
    "./images/posts/Component 95 – 2@2x.png",
  ];

  return (
    <div className="backdrop main-container make-post__wrapper">
      <div className="make-post">
        <div className="make-post__header-wrapper">
          <h2 className="make-post__title">Make a post</h2>

          <div className="close__wrapper" onClick={cb}>
            <svg className="close" width="20" height="20">
              <use href="./images/sprites/symbol-defs.svg#icon-close"></use>
            </svg>
          </div>
        </div>

        <div className="make-post__input">
          <div className="input-wrapper">
            <input
              className="input-text"
              type="text"
              name="name"
              placeholder="Say something nice…"
            />
            <span className="user-name__input-descr">Say something nice…</span>
          </div>
        </div>

        <div className="make-post__carusel-wrapper">
          <div className="make-post__carusel">
            {images.map((el, i) => (
              <img
                key={i}
                className="make-post__carusel-post"
                src={el}
                alt="post"
                width="208"
                height="208"
              />
            ))}
          </div>
        </div>
        <div className="make-post__footer">
          <button className="btn btn__gradient make-post__btn" type="button">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
