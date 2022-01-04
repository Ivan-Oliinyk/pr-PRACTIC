import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
`;

export const CheckboxForgot: React.FC = ({ children }) => {
  return <Container>{children}</Container>;
};
