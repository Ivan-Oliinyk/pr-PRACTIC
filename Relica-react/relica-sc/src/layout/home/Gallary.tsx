import React, { useState } from "react";
import { GallatyNavigatin } from "./gallery/GallatyNavigatin";
import { GallaryContent } from "./gallery/GallaryContent";
import gallary from "./gallery/gallary.json";
import styled from "styled-components";
import Typography, { FontSize } from "../../components/typography/Typography";
import { a } from "../../styles/animation";
import { baseTheme } from "../../styles/theme";

const Container = styled.section`
  padding: 6rem 0;
`;

export const Gallery: React.FC = () => {
  // const [data = gallary, useCount] = useState(0);
  // const SortByLike = useState(
  //   data.sort((a, b) =>  )
  // );

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
