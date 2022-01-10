import { baseTheme } from "../../styles/theme";
import { FontSize } from "./Typography";
import { css } from "styled-components";

export interface IStyled {
  weight?: 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  fontSize?: FontSize;
  color?: string;
  lineHeight?: string;
  margin?: string;
  padding?: string;
  textAlign?: string;
}

export const TypographyStyled = css<IStyled>`
  font-weight: ${({ weight }) => weight || 400};
  color: ${({ theme, color }) => color || theme.colors.black};
  line-height: ${({ lineHeight }) => lineHeight || "130%"};
  margin: ${({ margin }) => margin || "0"};
  padding: ${({ padding }) => padding || "0"};
  font-size: ${({ fontSize }) => fontSize || FontSize.base};
  text-align: ${({ textAlign }) => textAlign || "auto"};

  // 1024
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
        : css`
            font-size: ${FontSize.base};
          `}
  }

  // 768
  @media (max-width: ${baseTheme.media.tablet}) {
    ${({ fontSize }) =>
      fontSize === FontSize.tl
        ? css`
            font-size: ${FontSize.ts};
          `
        : fontSize === FontSize.tm
        ? css`
            font-size: ${FontSize.ms};
          `
        : fontSize === FontSize.ts
        ? css`
            font-size: ${FontSize.ms};
          `
        : fontSize === FontSize.ms
        ? css`
            font-size: ${FontSize.mm};
          `
        : css`
            font-size: ${FontSize.base};
          `}
  }

  //480
  @media (max-width: ${baseTheme.media.mobileL}) {
    ${({ fontSize }) =>
      fontSize === FontSize.tl
        ? css`
            font-size: ${FontSize.ms};
          `
        : fontSize === FontSize.tm
        ? css`
            font-size: ${FontSize.ms};
          `
        : fontSize === FontSize.ts
        ? css`
            font-size: ${FontSize.ms};
          `
        : fontSize === FontSize.ms
        ? css`
            font-size: ${FontSize.mm};
          `
        : css`
            font-size: ${FontSize.base};
          `}
  }
`;
