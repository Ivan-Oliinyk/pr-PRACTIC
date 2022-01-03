import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: ${baseTheme.media.laptop}) {
    margin-bottom: 2rem;
  }

  @media (max-width: ${baseTheme.media.mobileL}) {
    margin-bottom: 1.5rem;
  }
`;

interface ILogoImg {
  width?: string;
  height?: string;
}

const LogoImg = styled.img<ILogoImg>`
  width: ${({ width }) => width || "7.8rem"};
  height: ${({ height }) => height || "7.8rem"};

  @media (max-width: ${baseTheme.media.mobileL}) {
    width: 4.9rem;
    height: 4.9rem;
  }
`;

interface ITitle {
  weight?: string;
  color?: string;
  size?: string;
  margin?: string;
}

const Title = styled.p<ITitle>`
  margin-left: ${({ margin }) => margin || "0 0 0 0.46em"};
  font-size: ${({ size }) => size || baseTheme.size.titleBig};
  font-weight: ${({ weight }) => weight || baseTheme.weight.bolt};
  color: ${({ color }) => color || baseTheme.colors.white};

  @media (max-width: ${baseTheme.media.mobileL}) {
    font-size: ${baseTheme.size.titleSmall};
  }
`;

interface ILogoProps {
  imgWidth?: string;
  imgHeight?: string;
  color?: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  weight?: string;
  size?: string;
  margin?: string;
}

const Logo: React.FC<ILogoProps> = ({
  imgWidth,
  imgHeight,
  color,
  imgSrc,
  imgAlt,
  title,
  size,
  margin,
}) => {
  return (
    <LogoWrapper>
      <LogoImg src={imgSrc} alt={imgAlt} width={imgWidth} height={imgHeight} />
      <Title color={color} size={size} margin={margin}>
        {title}
      </Title>
    </LogoWrapper>
  );
};

export default Logo;
