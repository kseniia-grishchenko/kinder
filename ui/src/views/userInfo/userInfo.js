import React, { useEffect, useState } from "react";
import axios from "axios";
import UserImage from "../../components/image/image";
import "./userInfo.css";
import ButtonLink from "../../components/button/button";
import {Button} from "antd";

const UserInfo = ({ match }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const customUser = JSON.parse(localStorage.getItem("customUser"));
  const [currentUser, setCurrentUser] = useState();
  const userId = match.params.id;
  const [subscribed, setSubscribed] = useState(false);
  const [followed, setFollowed] = useState(false);

  const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

  const subscribe = async() => {
      const { data: user_from_db } = await axios.get(
        `${process.env.REACT_APP_API_URL}/update-relationship/${userId}/`,
          config
      );
    };

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
      <div id={"important"}>
        <div id={"subscribe-unsubscribe"}>
          <Button onClick={subscribe}>
                Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
