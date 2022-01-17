import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import EditPage from "./pages/EditPage";
import CreatePage from "./pages/CreatePage";
import Posts from "./pages/Posts";
import PostEditPage from "./pages/PostEditPage";

function App() {
  return (
    <div className="App">
      <div className="Header">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/:id/edit" element={<EditPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
          {/* <Route path="/posts/create" element={<PostCreatePage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
