import React from "react";
import { GallatyNavigatin } from "./gallery/GallatyNavigatin";
import { GallaryContent } from "./gallery/GallaryContent";
import gallary from "./gallery/gallary.json";

export const Gallery: React.FC = () => {
  return (
    <section className="chat-3 chat-4">
      <h1 className="chat-4__title">Explore</h1>
      <GallatyNavigatin />
      <GallaryContent data={gallary} />
    </section>
  );
};
