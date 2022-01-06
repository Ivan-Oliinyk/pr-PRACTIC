import React from "react";
import Typography from "../../../components/typography/Typography";

export const ChatDateMessage: React.FC = ({ children }) => {
  return (
    <>
      <Typography as="h2" weight={700} textAlign="center">
        {children}
      </Typography>
    </>
  );
};
