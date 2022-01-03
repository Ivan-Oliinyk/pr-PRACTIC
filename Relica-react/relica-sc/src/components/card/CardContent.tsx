import React from "react";
import styled from "styled-components";
import { IFlexProps } from "../common/FlexWrapper";
import { flexStyles } from "../common/FlexWrapper";

const ContentWrapper = styled.div<IFlexProps>`
  ${flexStyles}
`;
const CardContent: React.FC<IFlexProps> = ({ children, ...props }) => {
  return (
    <>
      <ContentWrapper {...props}>{children}</ContentWrapper>
    </>
  );
};

export default CardContent;
