import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../../components/userCard/userCard";
import "./subscriptions.css";

const Subscriptions = ({ match }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const userId = match.params.id;

  useEffect(() => {
    let cleanupFunction = false;

    const getSubscriptions = async () => {
      const { data: userSubscriptions } = await axios.get(
        `/subscriptions/${userId}/`
      );
      if (!cleanupFunction) setSubscriptions(userSubscriptions);
    };

    getSubscriptions().catch((err) => console.log(err));
    return () => (cleanupFunction = true);
  }, [userId]);

  return (
    <div id={"subscriptions"}>
      {subscriptions?.map((subscription) => (
        <UserCard user={subscription} key={subscription.id} />
      ))}
    </div>
  );
};

export default Subscriptions;
