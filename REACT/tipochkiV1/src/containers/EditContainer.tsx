import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form, { TFormField } from "../components/Form";
import {
  TUser,
  UsersDispatchContext,
  UsersStateContext,
} from "../contexts/UsersContext";
import skills from "../skills.json";

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
  { name: "name", title: "Name", data: {}, type: "text" },
  { name: "email", title: "Email", data: {}, type: "text" },
  {
    name: "skills",
    title: "Skills",
    data: {
      options: skills.map((title) => ({ title, value: title })),
    },
    type: "multiply",
  },
];

const EditContainer = ({ id }: TEditContainerProps) => {
  const navigate = useNavigate();
  const items = useContext(UsersStateContext);
  const dispatch = useContext(UsersDispatchContext);

  const [item, setItem] = useState<TUser | undefined>(find(items, id));

  const handleOnChange = (key: string, value: unknown) => {
    setItem({
      ...(item as TUser),
      [key]: value,
    });
  };

  const handleOnSave = () => {
    dispatch(items.map((exItem) => (exItem._id === item?._id ? item : exItem)));
    navigate("/");
  };

  const handleOnRemove = () => {
    dispatch(items.filter((exItem) => exItem._id !== item?._id));
    navigate("/");
  };

  if (!item) {
    return <h2>Error: item not found</h2>;
  }

  return (
    <div>
      <Form fields={FIELDS} item={item} onChange={handleOnChange} />
      <hr />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <button onClick={handleOnRemove}>Remove</button>
        <button onClick={handleOnSave}>Save</button>
      </div>
    </div>
  );
};

export default EditContainer;
