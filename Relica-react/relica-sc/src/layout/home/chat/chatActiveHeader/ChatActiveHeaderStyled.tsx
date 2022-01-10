import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const ActiveChat = styled.div`
  flex: 0 0 8rem;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${baseTheme.colors.greySecondary};

  img {
    border-radius: 50%;
  }
`;
