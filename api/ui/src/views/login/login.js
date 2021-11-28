import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import './login.css'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import Modal from 'antd/es/modal/Modal'
import googleLogin from '../../components/google/google'
import GoogleLogin from 'react-google-login'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState()

  const history = useHistory()

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')) || null)
  }, [])

  useEffect(() => {
    if (user) {
      history.push('/')
    }
  }, [history, user])

  const onFinish = async () => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    }

    try {
      const { data: user } = await axios.post(
        '/login/',
        { username: username, password: password },
        config
      )
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)

      const { data: customUser } = await axios.get(
        `/custom-user/${user.id}/`
      )
      localStorage.setItem('customUser', JSON.stringify(customUser))
    } catch (error) {
      Modal.error({
        title: 'Something went wrong',
        content: error.response.data.detail
      })
    }
  }

   const responseGoogle = async(response) => {
    let googleResponse  = await googleLogin(response.accessToken)
    console.log(googleResponse);
    console.log(response);
  }

  return (
    <div className='login'>
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}
          onChange={(e) => setUsername(e.target.value)}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
          onChange={(e) => setPassword(e.target.value)}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <GoogleLogin
          clientId="386317483175-r0vcbmt63ml1fnh2a8s72svuvh52mlrg.apps.googleusercontent.com"
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      <Link to='/register'>Are you a new user? Register here</Link>
    </div>
  )
}

export default Login
