import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import "./login.css";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();

  const history = useHistory();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")) || null);
  }, []);

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [history, user]);

  const onFinish = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data: user } = await axios.post(
      `${process.env.REACT_APP_API_URL}/login/`,
      { username: username, password: password },
      config
    );
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  };

  return (
    <div className={"login"}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
          onChange={(e) => setUsername(e.target.value)}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          onChange={(e) => setPassword(e.target.value)}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
