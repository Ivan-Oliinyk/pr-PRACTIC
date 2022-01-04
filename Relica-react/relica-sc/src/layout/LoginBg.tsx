import React from "react";
import styled from "styled-components";
import Logo from "../components/logo/Logo";
// import Typography from "../components/typography/Typography";
// import { TagVariants } from "../components/typography/Typography";
import { baseTheme } from "../styles/theme";

const ContainerBg = styled.div`
  padding: 12.88% 1.46% 3.66% 7.32%;
  background-image: url("/images/bg2x.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 56%;
  height: 100vh;

  @media (max-width: ${baseTheme.media.laptop}) {
    width: 100vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: ${baseTheme.size.titleMedium};
  line-height: ${baseTheme.lineHeight.medium};
  font-weight: ${baseTheme.weight.bolt};
  width: "50rem";
  color: ${baseTheme.colors.white};

  @media (max-width: ${baseTheme.media.laptop}) {
    font-size: ${baseTheme.size.titleSmall};
    text-align: center;
  }

  @media (max-width: ${baseTheme.media.mobileL}) {
    font-size: ${baseTheme.size.big};
  }
`;

const LoginBg: React.FC = () => {
  return (
    <ContainerBg>
      <Logo
        color={baseTheme.colors.white}
        imgSrc="/images/logo.png"
        imgAlt="logo"
        title="Relica"
      />
      <Title>Post photos. Make money. Maintain ownership</Title>
      {/* <Typography
        tagName={TagVariants.h1}
        size={baseTheme.size.titleMedium}
        height={baseTheme.lineHeight.medium}
        weight={baseTheme.weight.bolt}
        children="Post photos. Make money. Maintain ownership"
        width="50rem"
        color={baseTheme.colors.white}
      /> */}
    </ContainerBg>
  );
};

export default LoginBg;
