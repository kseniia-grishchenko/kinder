import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import UserCard from "../../components/userCard/userCard";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || null;
    const getUsers = async () => {
      const { data: users_from_db } = await axios.get(
        `/users/`
      );
      currentUser
        ? setUsers(users_from_db.filter((user) => user.user !== currentUser.id))
        : setUsers(users_from_db);
    };

    getUsers().catch((err) => console.log(err));
  }, []);

  return (
    <div id={"users"}>
      {users?.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
    </div>
  );
};

export default Home;
