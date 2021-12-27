import React from "react";
import { Outlet } from "react-router-dom";
import { NotificationTitle } from "./notification/activeLog/NotificationTitle";
import { NotificationNavigate } from "./notification/activeLog/NotificationNavigate";

export const Notification: React.FC = () => {
  return (
    <section className="container-middle notification">
      <NotificationTitle title="Notification" />
      <NotificationNavigate />
      <Outlet />
    </section>
  );
};
