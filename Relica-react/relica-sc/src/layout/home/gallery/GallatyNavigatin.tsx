import React from "react";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";
import { List, NavWrapper } from "./GallatyNavigatinStyles";

type Props = {
  cb?: React.MouseEventHandler;
};

export const GallatyNavigatin: React.FC<Props> = ({ cb }) => {
  const listContent = ["Most recent", "Most liked", "Discovered"];

  return (
    <NavWrapper>
      <List>
        {listContent.map((el, i) => (
          <li key={i}>
            <button onClick={cb}>
              <Typography
                as="p"
                fontSize={FontSize.base}
                weight={700}
                textAlign="center"
                color="inherit"
              >
                {el}
              </Typography>
            </button>
          </li>
        ))}
      </List>
    </NavWrapper>
  );
};
