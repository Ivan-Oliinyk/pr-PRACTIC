import React from "react";
import { TableHeat } from "./TableHeat";
import { TableBody } from "./TableBody";
import tableBodyData from "./tableBodyData.json";
import { Table } from "./StatTableStyles";

export const StatTable: React.FC = () => {
  return (
    <Table className="stat-table">
      <TableHeat />
      <TableBody data={tableBodyData} />
    </Table>
  );
};
