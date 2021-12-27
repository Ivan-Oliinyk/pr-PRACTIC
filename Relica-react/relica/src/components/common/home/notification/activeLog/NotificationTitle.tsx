import React from "react";

type Title = {
  title: string;
};

export const NotificationTitle: React.FC<Title> = ({ title }) => {
  return <h1 className="notification__title">{title}</h1>;
};
