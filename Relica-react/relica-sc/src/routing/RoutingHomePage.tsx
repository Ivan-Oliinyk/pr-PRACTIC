import { Route, Routes } from "react-router-dom";
import Posts from "../layout/home/Posts";
import { Chat } from "../layout/home/Chat";
import { EditProfile } from "../layout/home/EditProfile";
import { Gallery } from "../layout/home/Gallary";
import { RoutingNotification } from "./RoutingNotification";
import Home from "../pages/Home";

const RoutingHomePage = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Posts />} />
        <Route path="Posts" element={<Posts />} />
        <Route path="Chat" element={<Chat />}></Route>
        <Route path="EditProfile" element={<EditProfile />} />
        <Route path="Gallery" element={<Gallery />} />
        <Route path="/Notification/*" element={<RoutingNotification />} />
      </Route>
    </Routes>
  );
};

export default RoutingHomePage;
