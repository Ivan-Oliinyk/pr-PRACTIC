import React from "react";

export type RowProps = {
  image: string;
  likesCount: string | number;
  likesPersent: string;
  commentCount: string | number;
  commentPersent: string;
  favoritesCount: string | number;
  favoritesPersent: string;
};

export const TableBodyRow: React.FC<RowProps> = ({
  image,
  likesCount,
  likesPersent,
  commentCount,
  commentPersent,
  favoritesCount,
  favoritesPersent,
}) => {
  return (
    <tr>
      <td>
        <img src={image} alt="photo1" width="80" height="80" />
      </td>
      <td>
        <span className="text1">{likesCount}</span>
        <span className="text2">{likesPersent}</span>
      </td>
      <td>
        <span className="text1">{commentCount}</span>
        <span className="text2">{commentPersent}</span>
      </td>
      <td>
        <span className="text1">{favoritesCount}</span>
        <span className="text2">{favoritesPersent}</span>
      </td>
    </tr>
  );
};
