import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const Wrapper = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  flex: 0 0 8rem;
  min-width: 100%;
  border-top: 1px solid ${baseTheme.colors.greySecondary};
  display: flex;
  align-items: center;

  input {
    margin-top: 0;
    margin-left: 1.5rem;
    background-color: #edf2f5cb;
    border-radius: 1.5rem;
    font-size: 1.6rem;
    border: none;
    display: flex;
    align-items: center;
    padding: 1rem 4rem 1rem 1.5rem;
  }
`;

export const LoadFile = styled.div`
  background-color: #edf2f5cb;
  border-radius: 50%;
  width: 4.4rem;
  height: 4.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    fill: #afafaf;
  }
`;
