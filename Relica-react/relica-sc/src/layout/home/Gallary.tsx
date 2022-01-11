import React, { useState } from "react";
import { GallatyNavigatin } from "./gallery/GallatyNavigatin";
import { GallaryContent } from "./gallery/GallaryContent";
import Gallary from "./gallery/gallary.json";
import styled from "styled-components";
import Typography, { FontSize } from "../../components/typography/Typography";
import { Context } from "./gallery/Context";

const Container = styled.section`
  padding: 6rem 0;
`;

export const Gallery: React.FC = () => {
  const [gallary, setGallary] = useState(Gallary);

  const sortByDate = () => {
    setGallary(gallary.slice().sort((a, b) => a.date - b.date));
  };

  const sortByLikes = () => {
    setGallary(gallary.slice().sort((a, b) => b.likes - a.likes));
  };

  const sortByComments = () => {
    setGallary(gallary.slice().sort((a, b) => b.comments - a.comments));
  };

  const cbArray = [sortByComments, sortByLikes, sortByDate];

  return (
    <Container>
      <Typography
        as="h2"
        fontSize={FontSize.ts}
        weight={700}
        textAlign="center"
      >
        Explore
      </Typography>

      <GallatyNavigatin sortFuncArr={cbArray} />
      <GallaryContent data={gallary} />
    </Container>
  );
};
