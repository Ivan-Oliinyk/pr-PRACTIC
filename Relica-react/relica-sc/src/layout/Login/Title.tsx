import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

interface ITitleStyles {
  size?: string;
  weight?: string;
  subtitle?: string;
}

const TitleBig = styled.h2<ITitleStyles>`
  font-size: ${({ size }) => size || baseTheme.size.titleMedium};
  font-weight: ${baseTheme.weight.bolt};
  /* margin-bottom: 1rem; */

  @media (max-width: ${baseTheme.media.laptop}) {
    text-align: center;
    font-size: ${baseTheme.size.titleSmall};
  }

  @media (max-width: ${baseTheme.media.mobileL}) {
    font-size: ${baseTheme.size.big};
  }
`;

const Title: React.FC<ITitleStyles> = ({ size, children }) => {
  return (
    <>
      <TitleBig size={size}>{children}</TitleBig>
    </>
  );
};

export default Title;
