import styled, { css } from "styled-components";
import { baseTheme } from "../../styles/theme";

export interface IFlexProps {
  direction?: string;
  align?: string;
  justify?: string;
  margin?: string;
  width?: string;
  maxWidth?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  borderColor?: string;
  color?: string;
  bgColor?: string;
  bg?: string;
  minHeight?: string;
  size?: string;
  weight?: string | number;
}

export const flexStyles = css<IFlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  align-items: ${({ align }) => align || "stretch"};
  justify-content: ${({ justify }) => justify || "stretch"};
  width: ${({ width }) => width || "100%"};
  max-width: ${({ maxWidth }) => maxWidth || "100%"};
  margin: ${({ margin }) => margin || "0"};
  padding: ${({ padding }) => padding || "0"};
  border: ${({ border }) => border || "none"};
  border-color: ${({ borderColor }) => borderColor || "none"};
  border-radius: ${({ borderRadius }) => borderRadius || "none"};
  color: ${({ color }) => color || baseTheme.colors.black};
  background-color: ${({ bgColor }) => bgColor || baseTheme.colors.white};
  background: ${({ bg }) => bg || baseTheme.colors.white};
  min-height: ${({ minHeight }) => minHeight || "auto"};
  font-size: ${({ size }) => size || baseTheme.size.base};
  font-weight: ${({ weight }) => weight || baseTheme.weight.normal};
`;

export const FlexWrapper = styled("div")<IFlexProps>`
  ${flexStyles}
`;
