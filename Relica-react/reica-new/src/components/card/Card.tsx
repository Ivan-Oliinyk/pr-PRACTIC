import React from "react";

import { CardHeader } from "./CardHeader";
// import { CardContent } from "./CardContent";
// import { CardFooter } from "./CardFooter";

// import { Typography } from "../typography/Typography";
import { TagVariants } from "../typography/Typography";
// import { TypographyProps } from "../typography/Typography";

export const Card: React.FC = () => {
  return (
    <Card>
      <CardHeader
        tagname={TagVariants.h2}
        classname="h2 big"
        children="Welcome"
      />
      {/* <CardContent />
      <CardFooter /> */}
    </Card>
  );
};
