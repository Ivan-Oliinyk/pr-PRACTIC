import React, { useState } from "react";
import dataJSON from "../data/data.json";
import UserList from "./UserList";
import "./styles.css";

const Wrapper: React.FC = () => {
  const [data, setData] = useState(dataJSON);
  const [search, setSearch] = useState("");

  const sortByName = () =>
    setData(data.slice().sort((a, b) => a.list.localeCompare(b.list)));

  const sortByEmail = () => {
    setData(data.slice().sort((a, b) => a.email.localeCompare(b.email)));
  };

  const sortBySkills = () => {
    setData(data.slice().sort((b, a) => a.skills.length - b.skills.length));
  };

  const sortByID = () => {
    setData(data.slice().sort((a, b) => b._id - a._id));
  };

  const searchBy = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
    setData(data.slice().filter(({ _id }) => _id === Number(search)));
    console.log(data);
  };

  const deleteUser = (id: number) => {
    setData(data.slice().filter(({ _id }) => _id !== id));
  };

  return (
    <>
      <div className="port">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={searchBy}
        />
        <nav>
          <button type="button" onClick={sortByName}>
            Sort by Name
          </button>
          <button type="button" onClick={sortByEmail}>
            Sort by Email
          </button>
          <button type="button" onClick={sortBySkills}>
            More Skills
          </button>
          <button type="button" onClick={sortByID}>
            Sort by Id
          </button>
        </nav>
        <button className="Create" type="button">
          Create User
        </button>
      </div>
      <UserList dataList={data} />
    </>
  );
};

export default Wrapper;
