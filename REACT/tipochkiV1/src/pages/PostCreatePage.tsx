import React from "react";
import PostCreateContainer from "../containers/PostCreateContainer";

const PostCreatePage = () => {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Post Create</h2>
      <hr />
      <div className="Container">
        <PostCreateContainer />
      </div>
    </div>
  );
};

export default PostCreatePage;
