import React from "react";
import styled, { css } from "styled-components";
import { baseTheme } from "../../styles/theme";

interface IStyled {
  weight?: 200 | 300 | 400 | 500 | 600 | 700;
  fontSize?: FontSize;
  color?: string;
  lineHeight?: string;
  margin?: string;
  padding?: string;
}

export enum FontSize {
  tl = "4.3rem",
  tm = "4rem",
  ts = "3.5rem",
  ms = "2.8rem",
  mm = "2rem",
  ml = "1.6rem",
  base = "1.6rem",
  sl = "1.4rem",
  sm = "1.2rem",
  ss = "1rem",
}

const TitleStyled = css<IStyled>`
  font-weight: ${({ weight }) => weight || 400};
  color: ${({ theme, color }) => color || theme.colors.black};
  line-height: ${({ lineHeight = "130%" }) => lineHeight};
  margin: ${({ margin = "0" }) => margin};
  padding: ${({ padding = "0" }) => padding};
  font-size: ${({ fontSize }) => fontSize || FontSize.base};

  @media (max-width: ${baseTheme.media.laptop}) {
    ${({ fontSize }) =>
      fontSize === FontSize.tl
        ? css`
            font-size: ${FontSize.tm};
          `
        : fontSize === FontSize.tm
        ? css`
            font-size: ${FontSize.ts};
          `
        : fontSize === FontSize.ts
        ? css`
            font-size: ${FontSize.ms};
          `
        : fontSize === FontSize.ms
        ? css`
            font-size: ${FontSize.mm};
          `
        : fontSize === FontSize.ml
        ? css`
            font-size: ${FontSize.base};
          `
        : css`
            font-size: ${FontSize.base};
          `}
  }
`;

const Typography = styled.div<IStyled>`
  ${TitleStyled}
`;

// interface ITitleProps extends IStyled {
//   as?: string
// }

// const Typography: React.FC<ITitleProps> = ({ children, ...props }) => {
//   return (
//     <P {...props}>
//       {children}
//     </P>
//   );
// };

export default Typography;
