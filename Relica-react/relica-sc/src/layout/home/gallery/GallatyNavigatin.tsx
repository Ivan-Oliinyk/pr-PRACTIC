import React from "react";
import styled from "styled-components";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";
import { baseTheme } from "../../../styles/theme";

const NavWrapper = styled.nav`
  max-width: 970px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  margin-top: 2rem;
  display: flex;

  li {
    padding: 0.5em;
    width: calc(100% / 3);
    color: ${baseTheme.colors.greyPrimary};
    border-bottom: 3px solid ${baseTheme.colors.greyPrimary};
    cursor: pointer;
    transition: all 250ms linear;

    &:hover,
    &:focus {
      border-bottom: 3px solid ${baseTheme.colors.blueV1};
      color: ${baseTheme.colors.blueV1};
    }
  }
`;

export const GallatyNavigatin: React.FC = () => {
  const listContent = ["Most recent", "Most liked", "Discovered"];

  return (
    <NavWrapper>
      <List>
        {listContent.map((el, i) => (
          <Typography
            as="li"
            fontSize={FontSize.base}
            weight={700}
            textAlign="center"
            key={i}
          >
            {el}
          </Typography>
        ))}
      </List>
    </NavWrapper>
  );
};
