import React, { useEffect, useState } from "react";
import axios from "axios";
import UserImage from "../../components/image/image";
import "./userInfo.css";
import ButtonLink from "../../components/button/button";
import { Button } from "antd";
import isSubscribed from "../../helpers/isSubscribed";
import isFollowed from "../../helpers/isFollowed";

const UserInfo = ({ match }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const customUser = JSON.parse(localStorage.getItem("customUser"));
  const [currentUser, setCurrentUser] = useState();
  const userId = match.params.id;
  const [subscribed, setSubscribed] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(async () => {
    let cleanupFunction = false;

    const getUser = async () => {
      const { data: user_from_db } = await axios.get(
        `/user/${userId}/`
      );

      setSubscribed(isSubscribed(customUser?.id, user_from_db));
      setFollowed(isFollowed(customUser?.id, user_from_db));

      if (!cleanupFunction) setCurrentUser(user_from_db);
    };

    getUser().catch((err) => console.log(err));

    return () => (cleanupFunction = true);
  }, [userId, subscribed]);

  const subscribe = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data: updated_user } = await axios.post(
      `/update-relationship/${userId}/`,
      {},
      config
    );
    setSubscribed(() => isSubscribed(customUser.id, updated_user));
  };

  return (
    <div className={"info"}>
      {currentUser && (
        <div id={"main-info"}>
          <UserImage url={currentUser.photo} />
          <div id={"important"}>
            <div id={"subscriptions-followers"}>
              <div>{currentUser.first_name}</div>
              <div>
                <ButtonLink
                  name={`${currentUser.first_name}'s subscriptions`}
                  url={`/subscriptions/${currentUser.user}`}
                  color={"#a7a8ae"}
                />
                <ButtonLink
                  name={`${currentUser.first_name}'s followers`}
                  url={`/followers/${currentUser.user}`}
                  color={"#a7a8ae"}
                />
              </div>
            </div>
            <div id={"location"}>{currentUser.location}</div>
            {subscribed && followed && <div>{currentUser.contact}</div>}
            <div>{currentUser.description}</div>
            {currentUser.id !== customUser.id &&
              (subscribed && subscribed === true ? (
                <div className={"subscribe"}>
                  <Button onClick={subscribe}>Unsubscribe</Button>
                </div>
              ) : (
                <div className={"subscribe"}>
                  <Button onClick={subscribe}>Subscribe</Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
