import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../../components/userCard/userCard";
import "./followers.css";

const Followers = ({ match }) => {
  const [followers, setFollowers] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const userId = match.params.id;

  useEffect(() => {
    let cleanupFunction = false;

    const getFollowers = async () => {
      if (userInfo) {
        const { data: userFollowers } = await axios.get(
          `${process.env.REACT_APP_API_URL}/followers/${userId}/`
        );
        if (!cleanupFunction) setFollowers(userFollowers);
      }
    };

    getFollowers().catch((err) => console.log(err));

    return () => (cleanupFunction = true);
  }, [userId, userInfo]);

  return (
    <div id={"followers"}>
      {followers?.map((follower) => (
        <UserCard user={follower} key={follower.id} />
      ))}
    </div>
  );
};

export default Followers;
