import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";

export const Item = styled.li`
  position: relative;
  width: 31.6rem;
  height: 31.6rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  overflow: hidden;
  border-radius: 1.5rem;
  transition: all 0.3s;

  img {
    border-radius: 1.5rem;
    object-fit: cover;
    object-position: center;
    transition: all 0.3s;
    transform: scale(1);
  }

  &:hover,
  &:focus {
    img {
      filter: brightness(60%);
      transform: scale(1.1);
    }

    div {
      opacity: 1;
    }
  }
`;

export const IconWrapper = styled.div`
  opacity: 0;
  transition: opacity 250ms linear;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 3rem;
  line-height: 3rem;
  font-weight: 600;
  display: flex;

  div {
    display: flex;
    align-items: center;

    &:first-of-type {
      margin-right: 1em;
    }
  }

  svg {
    fill: ${baseTheme.colors.white};
    margin-right: 1rem;
  }
`;
