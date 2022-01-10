import { Route, Routes } from "react-router-dom";
import { Notification } from "../layout/home/Notification";
import { ActiveLog } from "../layout/home/notification/activeLog/ActiveLog";
import { Income } from "../layout/home/notification/income/Income";

export const RoutingNotification = () => {
  return (
    <Routes>
      <Route path="/" element={<Notification />}>
        <Route index element={<ActiveLog />} />
        <Route path="Active-log" element={<ActiveLog />} />
        <Route path="Income" element={<Income />} />
      </Route>
    </Routes>
  );
};
