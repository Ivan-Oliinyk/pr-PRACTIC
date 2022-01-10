import React from "react";
import styled from "styled-components";
import { backdropStyles } from "../common/Backdrop";
import { baseTheme } from "../../styles/theme";
import InputText from "../form/InputText";
import Button from "../buttons/Button";
import {
  BtnWrapper,
  CloseWrapper,
  InputWrapper,
  MakePostHeader,
  MakePostWrapper,
  PostFooter,
  Slide,
  Slider,
  SliderWrapper,
  Title,
} from "./MakePostStyles";

const Container = styled.div`
  ${backdropStyles};
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
