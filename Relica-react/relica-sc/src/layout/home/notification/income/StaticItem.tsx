import React from "react";

export type Props = {
  image: string;
  title: string;
  price: number | string;
};

export const StaticItem: React.FC<Props> = ({ image, title, price }) => {
  return (
    <li className="statistic-item">
      <div className="statistic-item__img">
        <img src={image} alt="image1" width="58" height="58" />
      </div>
      <div className="statistic-item__context">
        <h2 className="stat-title">{title}</h2>
        <span className="price">{price}</span>
      </div>
    </li>
  );
};
