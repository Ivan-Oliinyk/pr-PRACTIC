import React from "react";
import Logo from "../../../components/logo/Logo";
import { baseTheme } from "../../../styles/theme";
import Typography from "../../../components/typography/Typography";
import { FontSize } from "../../../components/typography/Typography";
import { ContainerBg, Title } from "./LoginBgStyles";

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
