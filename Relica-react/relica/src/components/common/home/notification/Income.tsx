import React from "react";
import { IncomeTitle } from "./income/IncomeTitle";
import { StaticList } from "./income/StaticList";
import dataList from "./income/dataList.json";
import { StatTable } from "./income/StatTable";

export const Income: React.FC = () => {
  return (
    <div className="notification__content">
      <div className="contain-middle income">
        <IncomeTitle title="Total earned" />
        <StaticList data={dataList} />
        <StatTable />
      </div>
    </div>
    // </section>
  );
};
