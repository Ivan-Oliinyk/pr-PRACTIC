import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const Link = styled.a`
  color: ${baseTheme.colors.blueV1};
  font-size: ${baseTheme.size.base};
  font-weight: ${baseTheme.weight.large};
`;

type Props = { text: string };

export const ForgotLink: React.FC<Props> = ({ text }) => {
  return <Link href="">{text}</Link>;
};
