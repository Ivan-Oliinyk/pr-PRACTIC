import React, { useState } from "react";
import { Logo } from "../logo/Logo";
import { InputSearch } from "./Input-search";
import { BtnGradient } from "../btns/Btn-gradient";
import { SocialListLinks } from "./SocialListLinks";
import { Avatar } from "./Avatar";
import { MakePost } from "../makePost/MakePost";

export const Header: React.FC = () => {
  const [openModal, setOpenedModal] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-container container">
          <Logo linkTo="/HomePage" />
          <InputSearch />
          <BtnGradient
            value="Make a post"
            cb={() => setOpenedModal(!openModal)}
          />
          <SocialListLinks />
          <Avatar />
        </div>
      </header>
      {openModal && <MakePost cb={() => setOpenedModal(!openModal)} />}
    </>
  );
};
