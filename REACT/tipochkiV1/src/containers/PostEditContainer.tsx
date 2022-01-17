import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form, { TFormField } from "../components/Form";
import {
  TPosts,
  PostsStateContext,
  PostsDispatchContext,
} from "../contexts/PostsContext";

export type TEditContainerProps = {
  id: string;
};

export type THaveId = {
  _id: string;
};

function find<T extends THaveId>(items: T[], id: string): T | undefined {
  return items.find((item) => item._id === id);
}

const FIELDS: TFormField[] = [
  { name: "title", title: "Title", data: {}, type: "text" },
  { name: "body", title: "Body", data: {}, type: "text" },
];

const PostEditContainer = ({ id }: TEditContainerProps) => {
  const navigate = useNavigate();
  const posts = useContext(PostsStateContext);
  const dispatch = useContext(PostsDispatchContext);

  const [item, setItem] = useState<TPosts | undefined>(find(posts, id));

  const handleOnChange = (key: string, value: unknown) => {
    setItem({
      ...(item as TPosts),
      [key]: value,
    });
  };

  const handleOnSave = () => {
    dispatch(posts.map((exItem) => (exItem._id === item?._id ? item : exItem)));
    navigate("/posts");
  };

  const handleOnRemove = () => {
    dispatch(posts.filter((exItem) => exItem._id !== item?._id));
    navigate("/posts");
  };

  if (!item) {
    return <h2>Error: item not found!</h2>;
  }

  return (
    <div>
      <Form fields={FIELDS} item={item} onChange={handleOnChange} />
      <hr />
      <div>
        <button onClick={handleOnRemove}>Delete</button>
        <button onClick={handleOnSave}>Save</button>
      </div>
    </div>
  );
};

export default PostEditContainer;
