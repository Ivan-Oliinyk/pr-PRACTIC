import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: block;
  border-radius: 50%;
  border: 2px solid transparent;
  min-width: 4.5rem;
  min-height: 4.5rem;
  cursor: pointer;

  &:hover,
  &:focus {
    border: 2px solid $color-blue-v1;
  }
`;

const Image = styled.img`
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  border: 2px solid $color-white;
`;

const List = styled.ul`
  display: none;
  position: absolute;
  z-index: 5;
  top: 6rem;
  right: -1.5rem;
  display: block;
  box-shadow: 0 0 1px #d6d6d6;
  border-radius: 1rem;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 0.65em 1em;
  width: 12.5em;
  min-height: 3.5em;
  border: 1px solid #d6d6d6;
  background-color: $color-white;
  font-size: 1.6rem;

  &:hover,
  &:focus {
    background-color: $color-grey;
  }

  &:first-of-type:hover,
  &:first-of-type:focus {
    &:before {
      border-bottom: 1.6rem solid $color-grey;
    }
  }

  &:not(:last-of-type) {
    border-bottom: none;
  }

  &:first-of-type {
    position: relative;
    border-radius: 1rem 1rem 0 0;

    &:before {
      content: "";
      position: absolute;
      top: -1.5rem;
      right: 2.8rem;
      z-index: 2;
      display: block;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 16px solid #fff;
    }

    &:after {
      content: "";
      position: absolute;
      top: -1.8rem;
      right: 2.7rem;
      display: block;
      width: 0;
      height: 0;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 18px solid #d6d6d6;
    }
  }

  &:last-of-type {
    border-radius: 0 0 10px 10px;
  }
`;

export const Avatar: React.FC = () => {
  const navigate = useNavigate();
  const items = [
    { text: "Profile", path: "Gallery" },
    { text: "Setting", path: "EditProfile" },
    { text: "Log out", path: "/" },
  ];

  return (
    <Container>
      <Image
        src="/images/header/sharon-garcia-KsSmVZJkHqo-unsplash.png"
        alt="avatar"
        width="43px"
        height="43px"
      />

      <List className="user-menu user-menu__list">
        {items.map(({ text, path }, i) => (
          <Item key={i} onClick={() => navigate(path)}>
            {text}
          </Item>
        ))}
      </List>
    </Container>
  );
};
