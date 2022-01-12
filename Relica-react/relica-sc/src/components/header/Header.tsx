import React, { useState } from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import Logo from "../logo/Logo";
import { InputSearch } from "../form/InputSearch";
import { SocialListLinks } from "./SocialListLinks";
import { Avatar } from "./Avatar";
import { MakePost } from "../makePost/MakePost";
import Button from "../buttons/Button";

const HeaderContainer = styled.header`
  position: fixed;
  z-index: 5;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-height: 9.6rem;
  background-color: ${baseTheme.colors.white};
  box-shadow: 0px 5px 15px ${baseTheme.colors.greyLight};
  display: flex;
  align-items: center;
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 136.6rem;
  padding: 0 2rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Header: React.FC = () => {
  const [openModal, setOpenedModal] = useState(false);

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo
            color={baseTheme.colors.black}
            imgSrc="/images/logo.png"
            imgAlt="logo"
            title="Relica"
            imgWidth="5rem"
            imgHeight="5rem"
            size="2.8rem"
            margin="1rem"
            linkTo="/Posts"
          />
          <InputSearch />
          <Button
            border="1px solid #939393"
            borderRadius="3rem"
            minHeight="4.6rem"
            justify="center"
            align="center"
            weight={baseTheme.weight.bolt}
            width="18.5rem"
            bg={baseTheme.gradients.bluetobluev1}
            borderColor={baseTheme.colors.blueV2}
            color={baseTheme.colors.white}
            cb={() => setOpenedModal(!openModal)}
          >
            Post
          </Button>
          <SocialListLinks />
          <Avatar />
        </HeaderContent>
      </HeaderContainer>
      {openModal && <MakePost cb={() => setOpenedModal(!openModal)} />}
    </>
  );
};
