import React from "react";

type Props = {
  classname: string;
};

export const Card: React.FC<Props> = ({ classname, children }) => {
  return (
    <>
      <div className={classname}>{children}</div>
    </>
  );
};
