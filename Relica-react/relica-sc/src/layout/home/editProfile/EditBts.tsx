import React from "react";
import styled from "styled-components";
import Button from "../../../components/buttons/Button";
import { baseTheme } from "../../../styles/theme";
// import { Button } from "../../../btns/Button";

const Wrapper = styled.ul`
  margin-top: 5.6rem;
  display: flex;
  justify-content: flex-end;

  li:not(:last-of-type) {
    margin-right: 2rem;
  }
`;

export const EditBts: React.FC = () => {
  const dataBtn = [" Discart change", "Save changes"];

  return (
    <Wrapper>
      {dataBtn.map((el, i) => (
        <li key={i}>
          <Button
            border="1px solid #939393"
            borderRadius="3rem"
            minHeight="4.6rem"
            width="18.4rem"
            justify="center"
            align="center"
            weight={baseTheme.weight.bolt}
          >
            {el}
          </Button>
        </li>
      ))}
    </Wrapper>
  );
};
