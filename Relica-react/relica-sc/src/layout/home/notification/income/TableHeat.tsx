import React from "react";

export const TableHeat: React.FC = () => {
  const tableHeadTitles = [
    { image: "/images/svg/comment1.svg", title: "Post" },
    { image: "/images/svg/comment1.svg", title: "Likes" },
    { image: "/images/svg/comment1.svg", title: "Comments" },
    { image: "/images/svg/comment1.svg", title: "Favourites" },
  ];

  return (
    <thead className="head">
      <tr>
        {tableHeadTitles.map(({ image, title }, i) => (
          <th key={i}>
            <img src={image} alt="" width="14" height="14" />
            <span>{title}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
};
