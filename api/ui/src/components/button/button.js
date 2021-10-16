import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import "./button.css";

const ButtonLink = ({ name, url, color }) => {
  return (
    <Button id={"button-link"} style={{ backgroundColor: color || "#1995ad" }}>
      <Link to={url}>{name}</Link>
    </Button>
  );
};

export default ButtonLink;
