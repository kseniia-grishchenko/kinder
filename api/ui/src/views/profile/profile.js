import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Modal from 'antd/es/modal/Modal'
import Map from '../../components/map/map'

const Profile = () => {
  const [customUser, setCustomUser] = useState()
  const [user, setUser] = useState()

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')) || null)
  }, [])

  useEffect(() => {
    if (user) {
      const getCustomUser = async () => {
        const { data: customUserFromDb } = await axios.get(
          `/custom-user/${user.id}/`
        )
        setCustomUser(customUserFromDb)
      }

      getCustomUser().catch((err) => console.log(err))
    }
  }, [user])

  const onFinish = async ({
    username,
    location,
    sex,
    budget,
    description,
    contact
  }) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    }
    try {
      await axios.put(
        '/profile/update/',
        {
          username,
          location,
          sex,
          budget,
          description,
          contact
        },
        config
      )
      alert('User info successfully updated')
    } catch (error) {
      alert(error.response.data.detail)
    }
  }

  return (
    <div>
      {customUser && (
        <Form
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 14
          }}
          layout='horizontal'
          initialValues={{
            size: 'default',
            username: customUser.first_name,
            location: customUser.location,
            sex: customUser.sex,
            contact: customUser.contact,
            budget: Number(customUser.budget),
            description: customUser.description,
          }}
          size='default'
          onFinish={onFinish}
        >
          <Form.Item label='Name' name='username'>
            <Input/>
          </Form.Item>
          <Form.Item label='Location' name='location'>
            <Input/>
          </Form.Item>
          <Form.Item label='Sex' name='sex'>
            <Select>
              <Select.Option value='Female'>Female</Select.Option>
              <Select.Option value='Male'>Male</Select.Option>
              <Select.Option value='Not chosen'>Not chosen</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Contact' name='contact'>
            <Input/>
          </Form.Item>
          <Form.Item label='Date of birth' name='date_of_birth'>
            <DatePicker />
          </Form.Item>
          <Form.Item label='Budget' name='budget'>
            <InputNumber/>
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <TextArea/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Update
            </Button>
          </Form.Item>
        </Form>
      )}
      <Map />
    </div>
  )
}

export default Profile
