import React from "react";
import { Link } from "react-router-dom";
import ListContainer from "../containers/ListContainer";

const ListPage = () => {
  return (
    <div>
      <h2 className="title-2">Users - List</h2>
      <hr />
      <div className="Container">
        <div className="link__wrapper">
          <Link className="link" to="/create">
            New
          </Link>
          <Link className="link" to="posts">
            Posts
          </Link>
        </div>
        <ListContainer />
      </div>
    </div>
  );
};

export default ListPage;
