import React from "react";
import styled from "styled-components";
interface ICardHeaderWrapper {
  margin?: string;
}

const CardHeaderWrapper = styled.div<ICardHeaderWrapper>`
  margin: ${(props) => props.margin || "0 0 4.3rem 0"};
`;

const CardHeader: React.FC<ICardHeaderWrapper> = ({ margin, children }) => {
  return <CardHeaderWrapper margin={margin}>{children}</CardHeaderWrapper>;
};

export default CardHeader;
