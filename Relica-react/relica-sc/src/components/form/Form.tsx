import React from "react";
import styled from "styled-components";

const Container = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 2.8rem;
`;

const Form: React.FC = ({ children }) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};

export default Form;
