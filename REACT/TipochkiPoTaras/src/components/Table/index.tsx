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
};

export default ({ items, fields, onClick, ...rest }: TTableProps) => {
  return (
    <table className="table">
      <thead className="head">
        <Head fields={fields} {...rest} />
      </thead>
      <tbody>
        {items.map((item) => (
          <Row key={item._id} item={item} fields={fields} onClick={onClick} />
        ))}
      </tbody>
    </table>
  );
};
