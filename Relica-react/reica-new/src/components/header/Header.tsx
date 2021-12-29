import React, { useState } from "react";
import { Logo } from "../logo/Logo";
import { InputSearch } from "./Input-search";
import { SocialListLinks } from "./SocialListLinks";
import { Avatar } from "./Avatar";
import { MakePost } from "../makePost/MakePost";
import { TagVariants } from "../typography/Typography";
import { Button } from "../button/Button";

export const Header: React.FC = () => {
  const [openModal, setOpenedModal] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-container container">
          <Logo
            linkTo="/HomePage"
            image="/images/logo.png"
            classname="h1 big bolt"
            text="Relica"
            tagname={TagVariants.p}
          />
          <InputSearch />
          <Button
            tagname={TagVariants.button}
            classname="btn active"
            cb={() => setOpenedModal(!openModal)}
            children="Make a post"
          />

          <SocialListLinks />
          <Avatar />
        </div>
      </header>
      {openModal && <MakePost cb={() => setOpenedModal(!openModal)} />}
    </>
  );
};
