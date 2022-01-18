import React from "react";
import Head from "./Head";
import Row from "./Row";

export type TTableField = {
  _id: string;
  title: string;
  sortable: boolean;
};

export type TBaseTableItem = {
  _id: string;
  [key: string]: any;
};

export type TTableProps<T extends TBaseTableItem = TBaseTableItem> = {
  items: T[];
  fields: TTableField[];
  sortField: string;
  sortDirection: string;
  onSortFieldChange: (value: string) => void;
  onSortDirectionChange: (value: "ASC" | "DESC") => void;
  onClick: (id: string) => void;
  post?: boolean;
};

export default ({ items, fields, post, onClick, ...rest }: TTableProps) => {
  return (
    <table>
      <thead>
        <Head fields={fields} {...rest} />
      </thead>
      <tbody>
        {items.map((item) => (
          <Row
            post={post}
            key={item._id}
            item={item}
            fields={fields}
            onClick={onClick}
          />
        ))}
      </tbody>
    </table>
  );
};
