import React from "react";
import styled from "styled-components";

const Label = styled.label`
  display: flex;
  padding: 1rem 0;
  align-items: center;
  font-size: 1.6rem;
  cursor: pointer;
`;

const Input = styled.input`
  margin-right: 1rem;
  width: 2.2rem;
  height: 2.2rem;
`;

type Props = { text: string };

export const Checkbox: React.FC<Props> = ({ text }) => {
  return (
    <Label>
      <Input type="checkbox" />
      {text}
    </Label>
  );
};
