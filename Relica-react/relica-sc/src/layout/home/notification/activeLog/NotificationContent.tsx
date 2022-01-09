import React from "react";
import styled from "styled-components";
import { ActiveLogItem } from "./ActiveLogItem";
import { Props } from "./ActiveLogItem";

const ContentWrapper = styled.div`
  padding: 2rem 0;
`;

interface Items {
  items: Props[];
}

export const NotificationContent: React.FC<Items> = ({ items }) => {
  return (
    <ContentWrapper>
      {items.map(({ image, alt, user, reaction, timeAgo, targetImg }, i) => (
        <ActiveLogItem
          key={i}
          image={image}
          alt={alt}
          user={user}
          reaction={reaction}
          timeAgo={timeAgo}
          targetImg={targetImg}
        />
      ))}
    </ContentWrapper>
  );
};
