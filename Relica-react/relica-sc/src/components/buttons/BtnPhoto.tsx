import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 40rem;
  min-height: 11rem;
  border: 1px solid ${baseTheme.colors.greySecondary};
  border-radius: 1rem;
  cursor: pointer;

  &:hover,
  &:focus {
    border: 1px solid ${baseTheme.colors.blueV1};
  }
`;

const TextWrapper = styled.div`
  margin-left: 2.5rem;
`;

const ImgWrapper = styled.div`
  width: 7rem;
  height: 7rem;
  position: relative;

  img:nth-of-type(1) {
    position: absolute;
  }

  img:nth-of-type(2) {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Title = styled.h3`
  font-size: 2rem;
  margin-top: 0;
`;

const Descr = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
`;

interface Ibntphoto {
  bgimage: string;
  img: string;
  title: string;
  subtitle: string;
}

export const BtnPhoto: React.FC<Ibntphoto> = ({
  bgimage,
  img,
  title,
  subtitle,
}) => {
  return (
    <Wrapper>
      <ImgWrapper>
        <img src={bgimage} width="69" height="69" alt="photo1" />
        <img src={img} width="30" height="24" alt="photo2" />
      </ImgWrapper>

      <TextWrapper>
        <Title>{title}</Title>
        <Descr>{subtitle}</Descr>
      </TextWrapper>
    </Wrapper>
  );
};
