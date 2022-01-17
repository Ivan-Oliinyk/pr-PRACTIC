import React from "react";
import { Link } from "react-router-dom";
import ListContainer from "../containers/ListContainer";

const ListPage = () => {
  return (
    <div>
      <h2 className="title-2">Users - List</h2>
      <hr />
      <div className="Container">
        <ListContainer />
      </div>
    </div>
  );
};

export default ListPage;
