import React from "react";
import { Image } from "antd";
import "./image.css";

const UserImage = ({ url }) => {
  return (
    <Image
      className={"user-image"}
      height={250}
      width={300}
      src={`${url}`}
    />
  );
};

export default UserImage;
