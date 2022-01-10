import React from "react";
import styled from "styled-components";
import { GallaryItem } from "./GallaryItem";
import { Props } from "./GallaryItem";

const GallaryContentWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 97rem;
  /* padding-top: 25rem; */
`;

const GallaryList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-right: -1rem;
  margin-bottom: -1rem;
`;

interface List {
  data: Props[];
}

export const GallaryContent: React.FC<List> = ({ data }) => {
  return (
    <GallaryContentWrapper>
      <GallaryList>
        {data.map(({ image, likes, comments }, i) => (
          <GallaryItem
            key={i}
            image={image}
            likes={likes}
            comments={comments}
          />
        ))}
      </GallaryList>
    </GallaryContentWrapper>
  );
};
