import React from "react";
import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

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
      <Meta
        avatar={
          <Avatar src={`${process.env.REACT_APP_API_URL}${user.photo}`} />
        }
        title={user.first_name}
        description={user.description}
      />
    </Card>
  );
};

export default UserCard;
