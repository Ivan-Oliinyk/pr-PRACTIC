import React from "react";
import { StaticItem } from "./StaticItem";
import { Props } from "./StaticItem";

interface IData {
  data: Props[];
}

export const StaticList: React.FC<IData> = ({ data }) => {
  return (
    <ul className="statistic-list">
      {data.map(({ image, title, price }, i) => (
        <StaticItem key={i} image={image} price={price} title={title} />
      ))}
    </ul>
  );
};
