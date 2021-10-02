import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../../components/userCard/userCard";
import "./subscriptions.css";

const Subscriptions = ({ match }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const userId = match.params.id;

  useEffect(() => {
    let cleanupFunction = false;

    const getSubscriptions = async () => {
      if (userInfo) {
        const { data: userSubscriptions } = await axios.get(
          `${process.env.REACT_APP_API_URL}/subscriptions/${userId}/`
        );
        if (!cleanupFunction) setSubscriptions(userSubscriptions);
      }
    };

    getSubscriptions().catch((err) => console.log(err));
    return () => (cleanupFunction = true);
  }, [userId, userInfo]);

  return (
    <div id={"subscriptions"}>
      {subscriptions?.map((subscription) => (
        <UserCard user={subscription} key={subscription.id} />
      ))}
    </div>
  );
};

export default Subscriptions;
