import React from "react";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";
import { AvatarWrapper, BgImage } from "./EditVisualStyles";

type PropsInfo = {
  title: string;
  images: string;
  userInfo: string;
};

export const EditVisual: React.FC<PropsInfo> = ({
  title,
  images,
  userInfo,
}) => {
  return (
    <>
      <Typography
        as="h1"
        weight={700}
        textAlign="center"
        fontSize={FontSize.ts}
        margin="0 0 0.8em 0"
      >
        {title}
      </Typography>

      <BgImage>
        <AvatarWrapper>
          <img src={images} alt="user" width="114" height="114" />
        </AvatarWrapper>
      </BgImage>
      <Typography
        weight={700}
        fontSize={FontSize.mm}
        textAlign="center"
        margin="4em 0 2em"
      >
        {userInfo}
      </Typography>
    </>
  );
};
