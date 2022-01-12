import React, { useState } from "react";
import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";
import InputText from "../../../components/form/InputText";
import { useParams } from "react-router-dom";
import gallaryJSON from "./gallary.json";
import { Props } from "./GallaryItem";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";

const Container = styled.div`
  max-width: 136.6rem;
  margin-left: auto;
  margin-right: auto;
  height: calc(100vh - 9.6rem);
  display: flex;
`;

const ImgWrapper = styled.div`
  width: 50%;
  height: 63rem;
  margin-right: 2.5rem;
  margin-top: 2.5rem;
  border-radius: 2.5rem;
  object-fit: cover;
  object-position: center;

  img {
    border-radius: 2.5rem;
  }
`;

const Content = styled.div`
  height: 100%;
  width: 50%;
  border-left: 2px solid ${baseTheme.colors.greyLight};
  border-right: 2px solid ${baseTheme.colors.greyLight};
`;

const ContentBody = styled.div`
  height: calc(100% - 12.8rem);
  width: 100%;
  border-bottom: 2px solid ${baseTheme.colors.greyLight};
`;

const ContextFooter = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 48.5rem;
`;

const AvatarMainWrapper = styled.div`
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  object-position: center;
  background-color: red;
`;

const GallaryPost: React.FC = () => {
  const [gallary, setGallary] = useState(gallaryJSON);
  const { id } = useParams();
  const ID: number = Number(id || 0);
  const item = gallary.find(({ id }) => id === ID);

  return (
    <Container>
      <ImgWrapper>
        <img src={item?.image} alt="{alt}" />
      </ImgWrapper>
      <Content>
        <ContentBody>
          <div>
            <AvatarMainWrapper>
              <img src="" alt="" />
            </AvatarMainWrapper>
            <div>
              <Typography as="h2" fontSize={FontSize.ms} weight={700}>
                Mikaela White
              </Typography>
              <Typography as="p" color={baseTheme.colors.greyPrimary}>
                3 minute ago
              </Typography>
            </div>
          </div>
        </ContentBody>
        <ContextFooter>
          <InputText value="Add comments" autoComplete="off"></InputText>
        </ContextFooter>
      </Content>
    </Container>
  );
};

export default GallaryPost;
