import React, { useContext, useState } from "react";
import { UsersStateContext } from "../contexts/UsersContext";
import { UsersDispatchContext } from "../contexts/UsersContext";
import { TUser } from "../contexts/UsersContext";

const CreatePage = () => {
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    _id: String(Date.now()),
    skills: "",
  });

  const dataList: { name: string; type: string }[] = [
    { name: "name", type: "text" },
    { name: "email", type: "email" },
    { name: "skills", type: "text" },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(data);

    addUser();
    console.log("users => ", users);
    resetForm();
  };

  const resetForm = () => {
    console.log("RESET");
    setData({ name: " ", email: " ", id: " ", skills: " " });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const addUser = () => {
    console.log("data.skills", data.skills.split(" "));
    setUsers({ ...users, ...{ ...data } });
    console.log("AAA=>!& ", users);
  };

  const users = useContext(UsersStateContext);
  const setUsers = useContext(UsersDispatchContext);

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2 className="title">Crete user form</h2>
      {dataList.map(({ name, type }, i) => (
        <div key={i}>
          <label htmlFor={String(i)}>{name} :</label>
          <input
            id={String(i)}
            type={type}
            name={name}
            value={data[name]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button className="submit" type="submit">
        Create user
      </button>
    </form>
  );
};

export default CreatePage;
