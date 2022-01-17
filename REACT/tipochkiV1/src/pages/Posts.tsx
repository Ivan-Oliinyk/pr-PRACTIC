import React from "react";
import { Link } from "react-router-dom";
import PostContainer from "../containers/PostContainer";

const Posts = () => {
  return (
    <div>
      <h2 className="title-2">Posts</h2>
      <hr />
      <div className="Container">
        <PostContainer />
      </div>
    </div>
  );
};

export default Posts;
