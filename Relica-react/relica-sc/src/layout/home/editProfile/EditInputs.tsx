import React from "react";
import styled from "styled-components";
import InputText from "../../../components/form/InputText";

const InputWrapper = styled.div`
  max-width: 65rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 6rem;
`;

export const EditInputs: React.FC = () => {
  const dataInput = ["Display name", "Email", "Bio"];

  return (
    <InputWrapper>
      {dataInput.map((item, i) => (
        <li key={i}>
          <InputText value={item}></InputText>
        </li>
      ))}
    </InputWrapper>
  );
};
