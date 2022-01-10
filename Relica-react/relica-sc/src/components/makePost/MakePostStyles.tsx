import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

export const MakePostWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${baseTheme.colors.white};
  min-height: 60rem;
  width: 77rem;
  border-radius: 1rem;
  overflow: hidden;
`;

export const MakePostHeader = styled.div`
  position: relative;
  padding: 2rem 0;
  border-bottom: 2px solid ${baseTheme.colors.greySecondary};
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

export const CloseWrapper = styled.div`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;
  transition: background-color 250ms linear;

  svg {
    fill: ${baseTheme.colors.greyLight};
    transition: fill 250ms linear;
  }

  &:hover,
  &:focus {
    background-color: ${baseTheme.colors.greySecondary};

    svg {
      fill: ${baseTheme.colors.black};
    }
  }
`;

export const InputWrapper = styled.div`
  padding: 0 2.5rem;
`;

export const SliderWrapper = styled.div`
  margin-top: 2rem;
  padding: 0 2.5rem;
`;

export const Slider = styled.div`
  display: flex;
  overflow: auto;
  padding-bottom: 2rem;
`;

export const Slide = styled.img`
  border-radius: 1rem;
  object-fit: cover;
  object-position: center;

  &:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

export const PostFooter = styled.div`
  margin-top: 10rem;
  border-top: 2px solid ${baseTheme.colors.greySecondary};
  padding-top: 1.5rem;
`;

export const BtnWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 18.5rem;
`;
