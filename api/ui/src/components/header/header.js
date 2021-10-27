import React, { useEffect, useState } from 'react'
import { Avatar, PageHeader } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import './header.css'
import ButtonLink from '../button/button'

const Header = () => {
  const history = useHistory()
  const [customUser, setCustomUser] = useState()
  const [user, setUser] = useState()

  useEffect(() => {
    setInterval(() => {
      setUser(JSON.parse(localStorage.getItem('user')) || null)
      setCustomUser(JSON.parse(localStorage.getItem('customUser')) || null)
    }, 1000)
  })

  const goHome = () => {
    history.push('/')
  }

  const logoutHandler = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('customUser')
    goHome()
  }

  return (
    <PageHeader>
      <div id='user-info'>
        {customUser
          ? (
            <Avatar
              size='large'
              src={`${customUser.photo}`}
              onClick={goHome}
            />
            )
          : (
            <Avatar size='large' icon={<UserOutlined />} onClick={goHome} />
            )}

        {customUser?.first_name
          ? (
            <div>
              <Link to='/profile'>{customUser.first_name}</Link>
            </div>
            )
          : (
            <div>
              <Link to='/login'>Log in</Link>
            </div>
            )}
      </div>
      {customUser && (
        <div id='relations'>
          <ButtonLink
            name='Subscriptions'
            url={`/subscriptions/${customUser.user}`}
          />
          <ButtonLink
            name='Followers'
            url={`/followers/${customUser.user}`}
          />
          {user && (
            <div id='logout' onClick={logoutHandler}>
              Log out
            </div>
          )}
        </div>
      )}
    </PageHeader>
  )
}

export default Header
