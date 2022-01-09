import React from "react";
import Typography, {
  FontSize,
} from "../../../../components/typography/Typography";

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
        <Typography as="p" weight={600}>
          {likesCount}
        </Typography>
        <Typography as="p" fontSize={FontSize.ml} weight={500} color="#2db922">
          {likesPersent}
        </Typography>
      </td>
      <td>
        <Typography as="p" weight={600}>
          {commentCount}
        </Typography>
        <Typography as="p" fontSize={FontSize.ml} weight={500} color="#2db922">
          {commentPersent}
        </Typography>
      </td>
      <td>
        <Typography as="p" weight={600}>
          {favoritesCount}
        </Typography>
        <Typography as="p" fontSize={FontSize.ml} weight={500} color="#2db922">
          {favoritesPersent}
        </Typography>
      </td>
    </tr>
  );
};
