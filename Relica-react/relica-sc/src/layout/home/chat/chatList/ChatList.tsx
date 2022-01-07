import React from "react";
import Typography, {
  FontSize,
} from "../../../../components/typography/Typography";
import { baseTheme } from "../../../../styles/theme";
import {
  List,
  MessageCount,
  MessageWrapper,
  UserInfo,
  Avatar,
} from "./ChatListStyles";
import PropsType from "../PropsType";

export const ChatList: React.FC<PropsType> = ({
  src,
  alt,
  userName,
  message,
  isMessage,
  messageCount,
}) => {
  return (
    <>
      <List>
        <Avatar src={src} alt={alt} width="56" height="56" />
        <UserInfo>
          <Typography as="h3" fontSize={FontSize.mm} weight={700}>
            {userName}
          </Typography>
          <MessageWrapper>
            <Typography as="p" color={baseTheme.colors.greyPrimary}>
              {message}
            </Typography>
          </MessageWrapper>
        </UserInfo>

        {isMessage && <MessageCount>{messageCount}</MessageCount>}
      </List>
    </>
  );
};
