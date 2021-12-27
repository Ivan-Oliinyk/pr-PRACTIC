import React from "react";
import { NotificationContent } from "./activeLog/NotificationContent";
import dataActiveLogs from "./activeLog/dataActiveLogs.json";

export const ActiveLog: React.FC = () => {
  return (
    <>
      <NotificationContent items={dataActiveLogs} />
    </>
  );
};
