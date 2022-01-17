import React, { useState } from "react";
// import data from "../data-l7P1yDRd0eO4EvNXu0KtS.json";
import posts from "../usersPosts.json";

export type TPosts = {
  _id: string;
  title: string;
  body: string;
  autor: string;
};

export type TUsersDispatch = (posts: TPosts[]) => void;

export const PostsStateContext = React.createContext<TPosts[]>([]);

export const PostsDispatchContext = React.createContext<TUsersDispatch>(
  console.log
);

function prepareData(): TPosts[] {
  return posts.map(({ _id, title, body, author_id }) => {
    return {
      _id: _id.toString(),
      title,
      body,
      autor: author_id.toString(),
    };
  });
}

const PostContext = ({ children }: React.PropsWithChildren<{}>) => {
  const [posts, setPosts] = useState<TPosts[]>(prepareData());
  return (
    <PostsStateContext.Provider value={posts}>
      <PostsDispatchContext.Provider value={setPosts}>
        {children}
      </PostsDispatchContext.Provider>
    </PostsStateContext.Provider>
  );
};

export default PostContext;
