import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal/Modal";

const Profile = () => {
  const [customUser, setCustomUser] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")) || null);
  }, []);

  useEffect(() => {
    if (user) {
      const getCustomUser = async () => {
        const { data: customUserFromDb } = await axios.get(
          `${process.env.REACT_APP_API_URL}/custom-user/${user.id}/`
        );
        setCustomUser(customUserFromDb);
      };

      getCustomUser().catch((err) => console.log(err));
    }
  }, [user]);

  const onFinish = async ({
    username,
    location,
    sex,
    budget,
    description,
    contact,
  }) => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/profile/update/`,
        {
          username,
          location,
          sex,
          budget,
          description,
          contact,
        },
        config
      );
      Modal.success({
        content: "User info successfully updated",
      });
    } catch (error) {
      Modal.error({
        title: "Something went wrong",
        content: error.response.data.detail,
      });
    }
  };

  return (
    <div>
      {customUser && (
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          initialValues={{
            size: "default",
          }}
          size="default"
          onFinish={onFinish}
        >
          <Form.Item label="Name" name={"username"}>
            <Input defaultValue={customUser.first_name} />
          </Form.Item>
          <Form.Item label="Location" name={"location"}>
            <Input defaultValue={customUser.location} />
          </Form.Item>
          <Form.Item label="Sex" name={"sex"}>
            <Select defaultValue={customUser.sex}>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Not chosen">Not chosen</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Contact" name={"contact"}>
            <Input defaultValue={customUser.contact} />
          </Form.Item>
          <Form.Item label="Date of birth" name={"date_of_birth"}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Budget" name={"budget"}>
            <InputNumber defaultValue={Number(customUser.budget)} />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <TextArea defaultValue={customUser.description} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Profile;
