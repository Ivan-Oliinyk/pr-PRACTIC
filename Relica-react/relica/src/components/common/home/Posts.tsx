import React from "react";
import { InputText } from "../../inputText/InputText";
import { UserPost } from "../../post/UserPost";

export const Post: React.FC = () => {
  return (
    <>
      <section className="user-post__wrapper">
        <div className="main-container">
          <div className="user-post">
            <img
              className="user-post-img"
              src="./images/user-post/user1.png"
              width="56"
              height="56"
              alt="user"
            />
            <div className="user-post__text-wrapper">
              <h2 className="title">Jessica Thorne</h2>
              <p className="time">3 minute ago</p>
            </div>
          </div>

          <p className="user-post__description">
            Japanese food with my friends Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua ali
          </p>

          <div className="user-post__img-wraper">
            <img
              className="img"
              src="./images/user-post/img-user1.png"
              alt="post"
            />
          </div>
          <div className="user-post__likes">
            <div className="user-post__likes-box">
              <img
                className="img"
                src="./images/user-post/favorite.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <p className="counter">124</p>
            </div>
            <div className="user-post__likes-box">
              <img
                className="img"
                src="./images/user-post/comment.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <p className="counter">123</p>
            </div>
          </div>

          <UserPost title="View 5 comments" />
          <InputText value="Add comments" />
        </div>
      </section>

      <section className="user-post__wrapper">
        <div className="main-container">
          <div className="user-post">
            <img
              className="user-post-img"
              src="./images/user-post/user2.png"
              width="56"
              height="56"
              alt="user"
            />
            <div className="user-post__text-wrapper">
              <h2 className="title">Max Richardson</h2>
              <p className="time">10 minute ago</p>
            </div>
          </div>

          <p className="user-post__description">
            Holiday with my friends at #place
          </p>

          <div className="user-post__img-wraper">
            <img
              className="img"
              src="./images/user-post/user2-post.png"
              alt="post"
            />
          </div>
          <div className="user-post__likes">
            <div className="user-post__likes-box">
              <img
                className="img"
                src="./images/user-post/favorite.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <p className="counter">124</p>
            </div>
            <div className="user-post__likes-box">
              <img
                className="img"
                src="./images/user-post/comment.svg"
                alt="favorite"
                width="22"
                height="20"
              />
              <p className="counter">123</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
