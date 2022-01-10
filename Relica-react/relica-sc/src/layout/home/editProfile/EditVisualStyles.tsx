import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";

export const BgImage = styled.div`
  background: url("/images/bg@2x.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  min-height: 22rem;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: block;
    width: 4rem;
    height: 4rem;
    background: url("/images/svg/edit-grey.svg");
    background-size: 2.5rem 2.5rem;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: ${baseTheme.colors.greyPrimary};
    border-radius: 50%;
    cursor: pointer;
  }
`;

export const AvatarWrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  width: 114px;
  height: 114px;
  &:hover,
  &:focus {
    transform: translate(-50%, 50%) scale(1);
  }

  :before {
    content: "";
    position: absolute;
    z-index: 2;
    bottom: 0;
    right: 0;
    display: block;
    width: 4rem;
    height: 4rem;
    background: url("/images/svg/edit.svg");
    background-size: 2.5rem 2.5rem;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #fff;
    border: 2px solid #10a5f5;
    border-radius: 50%;
    cursor: pointer;
  }

  img {
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }
`;
