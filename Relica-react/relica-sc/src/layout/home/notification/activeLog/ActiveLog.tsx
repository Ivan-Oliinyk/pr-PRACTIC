import React from "react";
import { NotificationContent } from "../NotificationContent";
import dataActiveLogs from "./dataActiveLogs.json";

export const ActiveLog: React.FC = () => {
  return (
    <>
      <NotificationContent items={dataActiveLogs} />
    </>
  );
};
