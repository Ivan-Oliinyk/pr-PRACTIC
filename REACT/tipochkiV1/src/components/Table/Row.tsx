import React from "react";
import { TBaseTableItem, TTableField } from ".";
import HeadFieldSortable from "./HeadFieldSortable";

export type TTableRowProps<T extends TBaseTableItem = TBaseTableItem> = {
  fields: TTableField[];
  item: T;
  onClick: (id: string) => void;
  post?: boolean;
};

export default ({ fields, item, onClick, post }: TTableRowProps) => {
  return (
    <tr>
      {fields.map((field) => (
        <td key={field._id} onClick={() => onClick(item._id)}>
          {String(item[field._id])}
        </td>
      ))}
      {post && (
        <td>
          <button type="button" onClick={() => console.log("Hellow")}>
            Posts
          </button>
        </td>
      )}
    </tr>
  );
};
