import React from "react";
import { TTableField, TTableProps } from ".";

export type TTableHeadFieldProps = {
  title: string;
};

export default ({ title }: TTableHeadFieldProps) => {
  return <th>{title}</th>;
};
