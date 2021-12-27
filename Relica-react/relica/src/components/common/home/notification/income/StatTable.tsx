import React from "react";
import { TableHeat } from "./TableHeat";
import { TableBody } from "./TableBody";
import tableBodyData from "./tableBodyData.json";

export const StatTable: React.FC = () => {
  return (
    <table className="stat-table">
      <TableHeat />
      <TableBody data={tableBodyData} />
    </table>
  );
};
