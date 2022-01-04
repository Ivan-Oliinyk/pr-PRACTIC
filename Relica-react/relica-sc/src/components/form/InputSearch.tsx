import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const Container = styled.div`
  /* margin-right: 5rem; */
  display: flex;
  align-items: center;
  padding: 0 1.6rem;
  border: 1px solid ${baseTheme.colors.greySecondary};
  border-radius: 5px;
  width: 50rem;
  min-height: 4.6rem;
`;

const Image = styled.img`
  margin-right: 2rem;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1.6rem;
  line-height: 1.6rem;
  border: none;
  outline: none;
`;

export const InputSearch: React.FC = () => {
  return (
    <Container>
      <Image src="/images/header/zoom-mini.svg" alt="zoom" />
      <Input
        type="search"
        name="search"
        aria-label="Search through site content"
        placeholder="Search form"
      />
    </Container>
  );
};
