import React, { useEffect, useState } from "react";
import axios from "axios";
import UserImage from "../../components/image/image";
import "./userInfo.css";
import ButtonLink from "../../components/button/button";

const UserInfo = ({ match }) => {
  const [user, setUser] = useState();
  const userId = match.params.id;

  useEffect(() => {
    let cleanupFunction = false;

    const getUser = async () => {
      const { data: user_from_db } = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${userId}/`
      );
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
            <div id={"subscriptions-followers"}>
              <div>{user.first_name}</div>
              <div>
                <ButtonLink
                  name={`${user.first_name}'s subscriptions`}
                  url={`/subscriptions/${user.user}`}
                  color={"#a7a8ae"}
                />
                <ButtonLink
                  name={`${user.first_name}'s followers`}
                  url={`/followers/${user.user}`}
                  color={"#a7a8ae"}
                />
              </div>
            </div>
            <div id={"location"}>{user.location}</div>
            <div>{user.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
