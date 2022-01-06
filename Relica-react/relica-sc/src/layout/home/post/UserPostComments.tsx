import React from "react";
import comments from "./comments.json";
import { Comments } from "./Comments";
import styled from "styled-components";
import Typography from "../../../components/typography/Typography";

const Wrapper = styled.div`
  margin-top: 2.7rem;
`;

const Content = styled.div`
  margin-bottom: 2.7rem;
  font-size: 1.6rem;
  font-weight: 600;
`;

const UserPostComments: React.FC = () => {
  const counter = comments.length;

  return (
    <Wrapper>
      <Content>
        <Typography as="h2" weight={700}>
          View {counter} comments
        </Typography>
      </Content>

      <Comments items={comments} />
    </Wrapper>
  );
};

export default UserPostComments;
