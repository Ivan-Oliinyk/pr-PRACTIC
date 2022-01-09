import React from "react";
import styled from "styled-components";
import { StaticItem } from "./StaticItem";
import { Props } from "./StaticItem";

const List = styled.ul`
  display: flex;
  margin-right: -1.5rem;
  margin-bottom: -1.5rem;

  li:nth-of-type(2) {
    span {
      color: #56e3c8;
    }
  }

  li:nth-of-type(3) {
    span {
      color: #e39578;
    }
  }
`;

interface IData {
  data: Props[];
}

export const StaticList: React.FC<IData> = ({ data }) => {
  return (
    <List>
      {data.map(({ image, title, price }, i) => (
        <StaticItem key={i} image={image} price={price} title={title} />
      ))}
    </List>
  );
};
