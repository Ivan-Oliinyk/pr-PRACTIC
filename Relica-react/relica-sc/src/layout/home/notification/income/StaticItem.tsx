import React from "react";
import styled from "styled-components";
import Typography, {
  FontSize,
} from "../../../../components/typography/Typography";
import { baseTheme } from "../../../../styles/theme";

const Item = styled.li`
  border-radius: 1.5rem;
  border: 1px solid #e3e3e3;
  padding: 3rem 4rem;
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  min-width: calc((100% / 3) - 1.5rem);
`;

const ImgWrapper = styled.div`
  margin-right: 1.2rem;
`;

const InfoWrapper = styled.div`
  span {
    color: ${baseTheme.colors.blueV1};
  }
`;

export type Props = {
  image: string;
  title: string;
  price: number | string;
};

export const StaticItem: React.FC<Props> = ({ image, title, price }) => {
  return (
    <Item>
      <ImgWrapper>
        <img src={image} alt="image1" width="58" height="58" />
      </ImgWrapper>
      <InfoWrapper>
        <Typography as="h2" color={baseTheme.colors.greyPrimary} weight={700}>
          {title}
        </Typography>
        <Typography as="span" weight={700} fontSize={FontSize.ts}>
          {price}
        </Typography>
      </InfoWrapper>
    </Item>
  );
};
