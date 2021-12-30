import React from "react";
import styled, { css } from "styled-components";

interface IStyled {
  size: string;
  height: string;
  weight: string;
  color?: string;
}

const fontStyles = css<IStyled>`
  font-size: ${(props) => props.size || "1.6rem"};
  line-height: ${(props) => props.height || 1.2};
  font-weight: ${(props) => props.weight || 400};
  color: ${(props) => props.color || "#fff"};
`;

const H1 = styled.h1`
  ${fontStyles}
`;

const H2 = styled.h2`
  ${fontStyles}
`;

type TypographyProps = {
  tagName: string;
  size: string;
  height: string;
  weight: string;
};

const Typography: React.FC<TypographyProps> = ({
  tagName,
  size,
  height,
  weight,
  children,
}) => {
  return (
    <>
      {tagName === "h1" ? (
        <H1 size={size} height={height} weight={weight}>
          {children}
        </H1>
      ) : (
        <H2 size={size} height={height} weight={weight}>
          {children}
        </H2>
      )}
    </>
  );
};

export default Typography;
