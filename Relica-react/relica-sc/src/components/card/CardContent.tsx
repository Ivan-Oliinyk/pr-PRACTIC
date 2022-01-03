import React from "react";
import styled from "styled-components";
import { IFlexProps } from "../common/FlexWrapper";
import { flexStyles } from "../common/FlexWrapper";
import { baseTheme } from "../../styles/theme";

const ContentWrapper = styled.div<IFlexProps>`
  ${flexStyles};
  button:first-of-type {
    margin-top: 6rem;
    margin-bottom: 2rem;
  }

  @media (max-width: ${baseTheme.media.laptop}) {
    button:first-of-type {
      margin-top: 4rem;
      margin-bottom: 1.5rem;
    }
  }
`;
const CardContent: React.FC<IFlexProps> = ({ children, ...props }) => {
  return (
    <>
      <ContentWrapper {...props}>{children}</ContentWrapper>
    </>
  );
};

export default CardContent;
