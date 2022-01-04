import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

interface ITitleStyles {
  size?: string;
  weight?: string;
  subtitle?: string;
}

const TitleBig = styled.h2<ITitleStyles>`
  font-size: ${(props) => props.size || baseTheme.size.titleMedium};
  font-weight: ${baseTheme.weight.bolt};
  /* margin-bottom: 1rem; */

  @media (max-width: ${baseTheme.media.laptop}) {
    text-align: center;
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
