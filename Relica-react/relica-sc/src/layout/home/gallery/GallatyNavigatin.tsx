import React from "react";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";
import { List, NavWrapper } from "./GallatyNavigatinStyles";

type Props = {
  // cb?: React.MouseEventHandler;
  sortFuncArr: (() => void)[];
};

export const GallatyNavigatin: React.FC<Props> = ({ sortFuncArr }) => {
  const listContent = ["Most recent", "Most liked", "Discovered"];

  return (
    <NavWrapper>
      <List>
        {listContent.map((el, i) => (
          <li key={i}>
            <button onClick={sortFuncArr[i]}>
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
