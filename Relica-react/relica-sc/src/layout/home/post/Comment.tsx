import React from "react";
import styled from "styled-components";
import Typography from "../../../components/typography/Typography";

const Item = styled.li`
  display: flex;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
`;

type Props = {
  userName: string;
  userComment: string;
};

export const Comment: React.FC<Props> = ({ userName, userComment }) => {
  return (
    <Item>
      <Typography as="h3" weight={600} margin="0 1rem 0 0">
        {userName}
      </Typography>
      <Typography as="p">{userComment}</Typography>
    </Item>
  );
};
