import React from "react";
import styled from "styled-components";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";
import { baseTheme } from "../../../styles/theme";

const ActiveChat = styled.div`
  flex: 0 0 8rem;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${baseTheme.colors.greySecondary};

  img {
    border-radius: 50%;
  }
`;

interface IChatActiveHeaderProps {
  image: string;
}

export const ChatActiveHeader: React.FC<IChatActiveHeaderProps> = ({
  image,
}) => {
  return (
    <ActiveChat>
      <img src={image} alt="user" width="39" height="39" />
      <Typography
        as="h3"
        weight={700}
        fontSize={FontSize.mm}
        margin="0 0 0 0.7em"
      >
        Max Richardson
      </Typography>
    </ActiveChat>
  );
};
