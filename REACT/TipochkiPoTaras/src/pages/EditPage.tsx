import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UsersStateContext } from "../contexts/UsersContext";

const EditPage = () => {
  console.log(useParams());
  // console.log(useParams.id);

  const users = useContext(UsersStateContext);
  const { id } = useParams();

  console.log(users);

  const ob = users.find(({ _id }) => _id === id);
  console.log(ob);

  return (
    <>
      <div>edit</div>
    </>
  );
};

export default EditPage;
