import React from "react";
import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const UserCard = ({ user }) => {
  return (
    <Card
      style={{ width: 300 }}
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Link to={`user/${user.id}`}>
        <Meta
          avatar={
            <Avatar src={`${process.env.REACT_APP_API_URL}${user.photo}`} />
          }
          title={user.first_name}
          description={user.description}
        />
      </Link>
    </Card>
  );
};

export default UserCard;
