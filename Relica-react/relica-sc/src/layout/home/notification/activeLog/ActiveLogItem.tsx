import React from "react";
import Typography from "../../../../components/typography/Typography";
import { baseTheme } from "../../../../styles/theme";
import {
  ActiveLogWrapper,
  ImageWrapper,
  Info,
  InfoWrapper,
  Like,
} from "./ActiveLogItemStyles";

export type Props = {
  image: string;
  alt: string;
  user: string;
  reaction: string;
  timeAgo: string;
  targetImg: string;
};

export const ActiveLogItem: React.FC<Props> = ({
  image,
  alt,
  user,
  reaction,
  timeAgo,
  targetImg,
}) => {
  return (
    <ActiveLogWrapper>
      <InfoWrapper>
        <Like>
          <img src={image} alt={alt} width="26" height="26" />
        </Like>
        <Info>
          <div>
            <Typography as="h3" weight={600} margin="0 0.5em 0 0">
              {user}
            </Typography>
            <Typography as="span" weight={500}>
              {reaction}
            </Typography>
          </div>
          <Typography as="span" color={baseTheme.colors.greyPrimary}>
            {reaction}
          </Typography>
        </Info>
      </InfoWrapper>
      <ImageWrapper>
        <img src={targetImg} width="56" height="56" alt="images" />
      </ImageWrapper>
    </ActiveLogWrapper>
  );
};
