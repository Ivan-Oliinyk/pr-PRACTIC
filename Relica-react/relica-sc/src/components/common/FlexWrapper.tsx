import styled, { css } from "styled-components";

export interface IFlexProps {
  direction?: string;
  align?: string;
  justify?: string;
  margin?: string;
  width?: string;
  padding?: string;
}

export const flexStyles = css<IFlexProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  align-items: ${(props) => props.align || "stretch"};
  justify-content: ${(props) => props.justify || "stretch"};
  width: ${(props) => props.width || "100%"};
  margin: ${(props) => props.margin || "0"};
  padding: ${(props) => props.padding || "0"};
`;

export const FlexWrapper = styled("div")<IFlexProps>`
  ${flexStyles}
`;
