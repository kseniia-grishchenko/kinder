import React from "react";
import { Avatar, Button, PageHeader } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <PageHeader>
      <div id={"user-info"}>
        <Avatar size="large" icon={<UserOutlined />} />
        {user?.username ? (
          <div>
            <Link to={"/profile"}>{user.username}</Link>
          </div>
        ) : (
          <div>
            <Link to={"/login"}>Log in</Link>
          </div>
        )}
      </div>
      {user && (
        <div id={"relations"}>
          <Button>
            <Link to={`/subscriptions/${user.id}`}>Subscriptions</Link>
          </Button>
          <Button>
            <Link to={`/followers/${user.id}`}>Followers</Link>
          </Button>
        </div>
      )}
    </PageHeader>
  );
};

export default Header;
