import React from "react";
import { NotificationTitle } from "./notification/activeLog/NotificationTitle";
import { NotificationNavigate } from "./notification/activeLog/NotificationNavigate";
import { NotificationContent } from "./notification/activeLog/NotificationContent";
import dataActiveLogs from "./notification/activeLog/dataActiveLogs.json";

export const Notification: React.FC = () => {
  return (
    <section className="container-middle notification">
      <NotificationTitle title="Notification" />
      <NotificationNavigate />
      <NotificationContent items={dataActiveLogs} />
    </section>
  );
};
