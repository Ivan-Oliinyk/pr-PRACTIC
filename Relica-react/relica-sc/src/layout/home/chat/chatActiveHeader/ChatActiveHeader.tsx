import React from "react";
import Typography, {
  FontSize,
} from "../../../../components/typography/Typography";
import { ActiveChat } from "./ChatActiveHeaderStyled";

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
