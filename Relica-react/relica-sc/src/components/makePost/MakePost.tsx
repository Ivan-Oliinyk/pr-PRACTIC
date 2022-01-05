import React from "react";
import styled from "styled-components";
import { backdropStyles } from "../common/Backdrop";
import { baseTheme } from "../../styles/theme";
import InputText from "../form/InputText";
import Button from "../buttons/Button";

const Container = styled.div`
  ${backdropStyles};
  position: relative;
`;

const MakePostWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${baseTheme.colors.white};
  min-height: 600px;
  width: 770px;
  border-radius: 10px;
  overflow: hidden;
`;

const MakePostHeader = styled.div`
  position: relative;
  padding: 20px 0;
  border-bottom: 2px solid ${baseTheme.colors.greySecondary};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

const CloseWrapper = styled.div`
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

const InputWrapper = styled.div`
  padding: 0 2.5rem;
`;

const SliderWrapper = styled.div`
  margin-top: 2rem;
  padding: 0 2.5rem;
`;

const Slider = styled.div`
  display: flex;
  overflow: auto;
  padding-bottom: 2rem;
`;

const Slide = styled.img`
  border-radius: 1rem;
  object-fit: cover;
  object-position: center;

  &:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

const PostFooter = styled.div`
  margin-top: 10rem;
  border-top: 2px solid ${baseTheme.colors.greySecondary};
  padding-top: 1.5rem;
`;

const BtnWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 18.5rem;
`;

type Props = {
  cb: () => void;
};

export const MakePost: React.FC<Props> = ({ cb }) => {
  const images = [
    "/images/posts/Component 96 – 1@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
    "/images/posts/Component 95 – 2@2x.png",
  ];

  return (
    <Container>
      <MakePostWrapper>
        <MakePostHeader>
          <Title>Make a post</Title>
          <CloseWrapper onClick={cb}>
            <svg width="20" height="20">
              <use href="/images/sprites/symbol-defs.svg#icon-close"></use>
            </svg>
          </CloseWrapper>
        </MakePostHeader>

        <InputWrapper>
          <InputText value="Say something nice…" name="text" />
        </InputWrapper>

        <SliderWrapper>
          <Slider>
            {images.map((el, i) => (
              <Slide key={i} src={el} alt="post" width="208" height="208" />
            ))}
          </Slider>
        </SliderWrapper>
        <PostFooter>
          <BtnWrapper>
            <Button
              border="1px solid #939393"
              borderRadius="3rem"
              minHeight="4.6rem"
              justify="center"
              align="center"
              weight={baseTheme.weight.bolt}
              width="18.5rem"
              bg={baseTheme.gradients.bluetobluev1}
              borderColor={baseTheme.colors.blueV2}
              color={baseTheme.colors.white}
            >
              Post
            </Button>
          </BtnWrapper>
        </PostFooter>
      </MakePostWrapper>
    </Container>
  );
};
