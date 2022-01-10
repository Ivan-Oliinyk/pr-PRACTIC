import React from "react";
import { GallatyNavigatin } from "./gallery/GallatyNavigatin";
import { GallaryContent } from "./gallery/GallaryContent";
import gallary from "./gallery/gallary.json";
import styled from "styled-components";
import Typography, { FontSize } from "../../components/typography/Typography";

const Container = styled.section`
  padding: 6rem 0;
`;

export const Gallery: React.FC = () => {
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
      <GallatyNavigatin />
      <GallaryContent data={gallary} />
    </Container>
  );
};
