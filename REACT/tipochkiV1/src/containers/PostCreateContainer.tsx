import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form, { TFormField } from "../components/Form";
import {
  TPosts,
  PostsDispatchContext,
  PostsStateContext,
} from "../contexts//PostsContext";
import { THaveId } from "./EditContainer";

const FIELDS: TFormField[] = [
  { name: "title", title: "Title", data: {}, type: "text" },
  { name: "body", title: "Body", data: {}, type: "text" },
];

function createNew<T extends THaveId>(): T {
  const innerFields = FIELDS.reduce(
    (acc: { [key: string]: unknown }, field) => {
      acc[field.name] = field.type === "text" ? "" : [];
      return acc;
    },
    {}
  );

  return {
    _id: String(Date.now()),
    ...innerFields,
  } as T;
}

const PostCreateContainer = () => {
  const navigate = useNavigate();
  const posts = useContext(PostsStateContext);
  const dispatch = useContext(PostsDispatchContext);

  const [item, setItem] = useState<TPosts>(createNew<TPosts>());

  const handleOnChange = (key: string, value: unknown) => {
    setItem({
      ...(item as TPosts),
      [key]: value,
    });
  };

  const handleOnSave = () => {
    dispatch(posts.concat(item));
    navigate("/posts");
  };

  const handleOnCancel = () => {
    navigate("/posts");
  };

  return (
    <div>
      <Form fields={FIELDS} item={item} onChange={handleOnChange} />
      <hr />
      <div>
        <button className="cancelBtn" onClick={handleOnCancel}>
          Cancel
        </button>
        <button className="saveBtn" onClick={handleOnSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PostCreateContainer;
