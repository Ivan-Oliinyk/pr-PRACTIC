import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const List = styled.ul`
  display: flex;
  margin-right: 2rem;
  cursor: pointer;
`;

const Item = styled.li`
  margin-right: 2.5rem;
`;

const Svg = styled.svg`
  fill: ${baseTheme.colors.greyPrimary};
  width: 2.4rem;
  height: 2.4rem;

  &:hover,
  &:focus {
    fill: ${baseTheme.colors.blueV3};
  }
`;

export const SocialListLinks: React.FC = () => {
  const navigate = useNavigate();

  const listData = [
    {
      src: "/images/symbol-defs.svg#icon-search",
      path: "Gallery",
    },
    {
      src: "/images/symbol-defs.svg#icon-bell",
      path: "Notification",
    },
    {
      src: "/images/symbol-defs.svg#icon-bubble-speak",
      path: "Chat",
    },
  ];

  return (
    <List className="header__social-list">
      {listData.map(({ src, path }, i) => (
        <Item
          key={i}
          className="header__social-item"
          onClick={() => navigate(path)}
        >
          <Svg className="icon">
            <use href={src}></use>
          </Svg>
        </Item>
      ))}
    </List>
  );
};
