import React from "react";
import { useParams, Navigate } from "react-router-dom";
import PostEditContainer from "../containers/PostEditContainer";

const PostEditPage = () => {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/posts" />;
  }

  return (
    <div>
      <h2>Post {id} Edit</h2>
      <hr />
      <div className="Container">
        <PostEditContainer id={id} />
      </div>
    </div>
  );
};

export default PostEditPage;
