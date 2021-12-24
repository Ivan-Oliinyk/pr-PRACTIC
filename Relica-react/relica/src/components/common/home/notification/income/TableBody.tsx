import React from "react";
import { TableBodyRow } from "./TableBodyRow";
import { RowProps } from "./TableBodyRow";

interface Idatarow {
  data: RowProps[];
}

export const TableBody: React.FC<Idatarow> = ({ data }) => {
  return (
    <tbody>
      {data.map(
        (
          {
            image,
            likesCount,
            likesPersent,
            commentCount,
            commentPersent,
            favoritesCount,
            favoritesPersent,
          },
          i
        ) => (
          <TableBodyRow
            key={i}
            image={image}
            likesCount={likesCount}
            likesPersent={likesPersent}
            commentCount={commentCount}
            commentPersent={commentPersent}
            favoritesCount={favoritesCount}
            favoritesPersent={favoritesPersent}
          />
        )
      )}
    </tbody>
  );
};
