import React from "react";

type Props = {
  classname: string;
};

export const CardHeader: React.FC<Props> = ({ classname, children }) => {
  return (
    <>
      <div className={classname}>{children}</div>
    </>
  );
};
