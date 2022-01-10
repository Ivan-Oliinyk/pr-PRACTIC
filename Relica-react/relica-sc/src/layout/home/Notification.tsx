import React from "react";
import { Outlet } from "react-router-dom";
import { NotificationNavigate } from "./notification/activeLog/NotificationNavigate";
import styled from "styled-components";
import Typography, { FontSize } from "../../components/typography/Typography";

const NotificationWrapper = styled.section`
  padding: 6rem 0;
  max-width: 97rem;
  margin-left: auto;
  margin-right: auto;
`;

export const Notification: React.FC = () => {
  return (
    <NotificationWrapper className="container-middle notification">
      <Typography
        fontSize={FontSize.ts}
        textAlign="center"
        margin="0 0 0.8em 0"
        weight={700}
      >
        Notification
      </Typography>
      <NotificationNavigate />
      <Outlet />
    </NotificationWrapper>
  );
};
