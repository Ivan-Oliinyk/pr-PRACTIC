import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const MessageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  &:not(:first-of-type) {
    margin-top: 4.5rem;
  }
`;

export const MyMessage = styled.div`
  position: relative;
  display: inline-block;
  padding: 0.7em 1.3em;
  margin-right: 1.5rem;
  background-color: ${baseTheme.colors.blueV1};
  font-size: 1.6rem;
  color: ${baseTheme.colors.white};
  max-width: 22rem;
  border-radius: 3rem 3rem 0 3rem;

  &:before {
    content: "7:12 am";
    display: block;
    position: absolute;
    left: -4em;
    bottom: -1em;
    font-size: 1.1rem;
    color: grey;
  }
`;
