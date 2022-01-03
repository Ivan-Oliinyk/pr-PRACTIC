import React from "react";
import styled from "styled-components";
import { IFlexProps } from "../common/FlexWrapper";
import { flexStyles } from "../common/FlexWrapper";

const CardWrapper = styled.div<IFlexProps>`
  ${flexStyles}
`;

const Card: React.FC<IFlexProps> = ({ children, ...props }) => {
  return <CardWrapper {...props}>{children}</CardWrapper>;
};

export default Card;
