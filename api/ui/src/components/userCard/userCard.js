import React from "react";
import { Avatar, Card } from "antd";
import { Link } from "react-router-dom";

const { Meta } = Card;

const UserCard = ({ user }) => {
  return (
    <Card style={{ width: 300 }}>
      <Link to={`/user/${user.user}`}>
        <Meta
          avatar={
            <Avatar
              src={`${user.photo}`}
              size="large"
            />
          }
          title={user.first_name}
          description={user.description}
        />
      </Link>
    </Card>
  );
};

export default UserCard;
