import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

interface ITitleStyles {
  size?: string;
  weight?: string;
  subtitle?: string;
}

const SubtitleStyles = styled.h3<ITitleStyles>`
  font-size: ${({ size }) => size || baseTheme.size.base};
  font-weight: ${baseTheme.weight.bolt};
  margin-top: 1rem;

  @media (max-width: ${baseTheme.media.laptop}) {
    text-align: center;
  }
`;

const Subtitle: React.FC = ({ children }) => {
  return <SubtitleStyles>{children}</SubtitleStyles>;
};

export default Subtitle;
