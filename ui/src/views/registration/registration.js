import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useHistory } from "react-router-dom";
import Modal from "antd/es/modal/Modal";
import axios from "axios";
import "./registration.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

    try {
      const { data: created_user } = await axios.post(
        `${process.env.REACT_APP_API_URL}/register/`,
        { username, email, password },
        config
      );
      localStorage.setItem("user", JSON.stringify(created_user));
      setUser(created_user);

      console.log(created_user);
      const { data: customUser } = await axios.get(
        `${process.env.REACT_APP_API_URL}/custom-user/${created_user.id}/`
      );
      localStorage.setItem("customUser", JSON.stringify(customUser));
    } catch (error) {
      Modal.error({
        title: "Something went wrong",
        content: error.response.data.detail,
      });
    }
  };

  return (
    <div className={"registration"}>
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
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
          onChange={(e) => setEmail(e.target.value)}
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

export default Registration;
