import React, { useEffect } from "react";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { useActions } from "../hooks/useAction";

const UserList: React.FC = () => {
  const { users, loading, error } = useTypeSelector(({ user }) => user);
  const { fetchUsers } = useActions();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <h1>Loading ... </h1>;
  }

  if (error) {
    return <h1>{Error}</h1>;
  }

  console.log(users);

  return (
    <div>
      {users.map(({ id, username }) => (
        <h3 key={id}>{username}</h3>
      ))}
    </div>
  );
};

export default UserList;
