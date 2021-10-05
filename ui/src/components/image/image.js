import React from "react";
import { Image } from "antd";
import "./image.css";

const UserImage = ({ url }) => {
  return (
    <Image
      className={"user-image"}
      height={250}
      width={300}
      src={`${process.env.REACT_APP_API_URL}${url}`}
    />
  );
};

export default UserImage;
