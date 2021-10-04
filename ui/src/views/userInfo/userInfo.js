import React, { useEffect, useState } from "react";
import axios from "axios";
import UserImage from "../../components/image/image";
import "./userInfo.css";

const UserInfo = ({ match }) => {
  const [user, setUser] = useState();
  const userId = match.params.id;
  console.log(userId);

  useEffect(() => {
    let cleanupFunction = false;

    const getUser = async () => {
      const { data: user_from_db } = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${userId}/`
      );
      console.log(user_from_db);
      if (!cleanupFunction) setUser(user_from_db);
    };

    getUser().catch((err) => console.log(err));

    return () => (cleanupFunction = true);
  }, [userId]);
  return (
    <div className={"info"}>
      {user && (
        <div id={"main-info"}>
          <UserImage url={user.photo} />
          <div id={"important"}>
            <div>{user.first_name}</div>
            <div id={"location"}>{user.location}</div>
            <div>{user.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
