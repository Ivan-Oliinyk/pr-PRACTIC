import React from "react";
import Typography, {
  FontSize,
} from "../../../../components/typography/Typography";
import { Item, ItemTwitter, List } from "./editNavStyles";

export const EditNav: React.FC = () => {
  const dataNav = [
    { title: "Edit profile" },
    { title: "Push notifications" },
    { title: "Language" },
    { title: "Security" },
    { title: "Contact" },
    { title: "About us" },
    { title: "Visit our Twitter page", twitter: true },
  ];

  return (
    <nav>
      <List>
        {dataNav.map(({ title, twitter }, i) =>
          twitter ? (
            <ItemTwitter key={i}>
              <Typography as="u" fontSize={FontSize.mm}>
                {title}
              </Typography>
            </ItemTwitter>
          ) : (
            <Item key={i}>{title}</Item>
          )
        )}
      </List>
    </nav>
  );
};
