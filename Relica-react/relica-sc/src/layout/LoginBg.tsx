import React from "react";
import styled from "styled-components";
import Logo from "../components/logo/Logo";
import Typography from "../components/typography/Typography";
import { TagVariants } from "../components/typography/Typography";
import { baseTheme } from "../styles/theme";

const ContainerBg = styled.div`
  padding: 12.88% 1.46% 3.66% 7.32%;
  background-image: url("/images/bg2x.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 56%;
  height: 100vh;

  @media (max-width: 992px) {
    width: 100%;
    height: 50vh;
  }
`;

const LoginBg: React.FC = () => {
  return (
    <ContainerBg>
      <Logo
        color="#fff"
        imgSrc="/images/logo.png"
        imgAlt="logo"
        title="Relica"
      />
      <Typography
        tagName={TagVariants.h1}
        size={baseTheme.size.titleMedium}
        height={baseTheme.lineHeight.medium}
        weight={baseTheme.weight.bolt}
        children="Post photos. Make money. Maintain ownership"
        width="50rem"
        color={baseTheme.colors.white}
      />
    </ContainerBg>
  );
};

export default LoginBg;
