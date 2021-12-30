import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 4.3rem;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 1.82em;
  height: 1.82em;
`;

const Title = styled.p`
  margin-left: 0.46em;
  font-size: 4.3rem;
  font-weight: 600;
  color: ${(props) => props.color || baseTheme.colors.white};
`;

interface ILogoProps {
  color?: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
}

const Logo: React.FC<ILogoProps> = ({ color, imgSrc, imgAlt, title }) => {
  return (
    <LogoWrapper>
      <LogoImg src={imgSrc} alt={imgAlt} />
      <Title color={color}>{title}</Title>
    </LogoWrapper>
  );
};

export default Logo;
