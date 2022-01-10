import styled from "styled-components";
import { IStyled, TypographyStyled } from "./TypograpphyStyles";

export enum FontSize {
  tl = "4.3rem",
  tm = "4rem",
  ts = "3.5rem",
  ml = "3rem",
  ms = "2.8rem",
  mb = "2.4rem",
  mm = "2rem",
  base = "1.6rem",
  sl = "1.4rem",
  sm = "1.2rem",
  ss = "1rem",
}

const Typography = styled.div<IStyled>`
  ${TypographyStyled}
`;

export default Typography;
