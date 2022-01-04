import React from "react";
import styled, { css } from "styled-components";
import { backdropStyles } from "../common/Backdrop";
import { styleContainerMini } from "../common/Containers";
import { baseTheme } from "../../styles/theme";

const Container = styled.div`
  ${backdropStyles};
  ${styleContainerMini};
  position: relative;

  .make-post {
    /* position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: $color-white;
    min-height: 600px;
    width: 770px;
    border-radius: 10px;
    overflow: hidden; */

    /* .make-post__header-wrapper {
      position: relative;
      padding: 20px 0;
      border-bottom: 2px solid $color-grey-v4;
    } */

    /* .make-post__title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
    } */

    .close__wrapper {
      /* position: absolute;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);

      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      width: 3.2rem;
      height: 3.2rem;
      cursor: pointer;
      transition: background-color 250ms linear; */

      /* .close {
        fill: $color-grey-v5;
        transition: fill 250ms linear;
      }

      &:hover,
      &:focus {
        background-color: $color-grey-v4;

        .close {
          fill: $color-black;
        }
      } */
    }
  }

  .make-post__input {
    padding: 0 2.5rem;
  }

  .make-post__carusel-wrapper {
    margin-top: 2rem;
    padding: 0 2.5rem;

    .make-post__carusel {
      display: flex;
      overflow: auto;
      padding-bottom: 2rem;
    }

    .make-post__carusel-post {
      border-radius: 1rem;
      object-fit: cover;
      object-position: center;

      &:not(:last-of-type) {
        margin-right: 1rem;
      }
    }
  }

  .make-post__footer {
    margin-top: 10rem;
    border-top: 2px solid ${baseTheme.colors.greySecondary};

    .make-post__btn {
      margin-left: auto;
      margin-right: auto;
      margin-top: 2rem;
      max-width: 18.5rem;
    }
  }
`;

const MakePostWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${baseTheme.colors.white};
  min-height: 600px;
  width: 770px;
  border-radius: 10px;
  overflow: hidden;
`;

const MakePostHeader = styled.div`
  position: relative;
  padding: 20px 0;
  border-bottom: 2px solid ${baseTheme.colors.greySecondary};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

const CloseWrapper = styled.div`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;
  transition: background-color 250ms linear;

  svg {
    fill: ${baseTheme.colors.greyLight};
    transition: fill 250ms linear;
  }

  &:hover,
  &:focus {
    background-color: ${baseTheme.colors.greySecondary};

    svg {
      fill: ${baseTheme.colors.black};
    }
  }
`;

type Props = {
  cb: () => void;
};

export const MakePost: React.FC<Props> = ({ cb }) => {
  const images = [
    "/images/posts/Component 96 – 1@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
  ];

  return (
    <Container className="backdrop main-container make-post__wrapper">
      <MakePostWrapper className="make-post">
        <MakePostHeader className="make-post__header-wrapper">
          <Title className="make-post__title">Make a post</Title>

          <CloseWrapper className="close__wrapper" onClick={cb}>
            <svg className="close" width="20" height="20">
              <use href="/images/sprites/symbol-defs.svg#icon-close"></use>
            </svg>
          </CloseWrapper>
        </MakePostHeader>

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
      </MakePostWrapper>
    </Container>
  );
};
