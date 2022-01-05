import React from "react";
import styled from "styled-components";
import Logo from "../../components/logo/Logo";
import { baseTheme } from "../../styles/theme";
import Typography from "../../components/typography/Typography";
import { FontSize } from "../../components/typography/Typography";

const ContainerBg = styled.div`
  padding: 12.88% 1.46% 3.66% 7.32%;
  background-image: url("/images/bg2x.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 56%;
  height: 100vh;

  h1 {
    margin-top: 3rem;
  }

  @media (max-width: ${baseTheme.media.laptop}) {
    width: 100vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;

    h1 {
      margin-top: 0;
    }
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

      <Title>
        <Typography
          as="h1"
          fontSize={FontSize.tl}
          weight={700}
          color={baseTheme.colors.white}
        >
          Post photos. Make money. Maintain ownership
        </Typography>
      </Title>
    </ContainerBg>
  );
};

export default LoginBg;
