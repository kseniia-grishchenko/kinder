import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UserImage from '../../components/image/image'
import './userInfo.css'
import ButtonLink from '../../components/button/button'
import { Button } from 'antd'
import isSubscribed from '../../helpers/isSubscribed'
import isFollowed from '../../helpers/isFollowed';
import { List, Typography, Divider } from 'antd';

const UserInfo = ({ match }) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const customUser = JSON.parse(localStorage.getItem('customUser'))
  const [currentUser, setCurrentUser] = useState()
  const userId = match.params.id
  const [subscribed, setSubscribed] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [tags, setTags] = useState([])

  useEffect(async () => {
    let cleanupFunction = false

    const getUser = async () => {
      const { data: userFromDb } = await axios.get(
        `/user/${userId}/`
      )

      const { data: userTags } = await axios.get(
          `/get-user-tags/${userId}/`
      )

      setTags(userTags);
      setSubscribed(isSubscribed(customUser?.id, userFromDb))
      setFollowed(isFollowed(customUser?.id, userFromDb))

      if (!cleanupFunction) setCurrentUser(userFromDb)
    }

    getUser().catch((err) => console.log(err))

    return () => (cleanupFunction = true)
  }, [userId, subscribed])

  const subscribe = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    const { data: updated_user } = await axios.post(
      `/update-relationship/${userId}/`,
      {},
      config
    )
    setSubscribed(() => isSubscribed(customUser.id, updated_user))
  }

  return (
    <div className='info'>
      {currentUser && (
        <div id='main-info'>
          <UserImage url={currentUser.photo} />
          <div id='important'>
            <div id='subscriptions-followers'>
              <div>{currentUser.first_name}</div>
              <div>
                <ButtonLink
                  name={`${currentUser.first_name}'s subscriptions`}
                  url={`/subscriptions/${currentUser.user}`}
                  color='#a7a8ae'
                />
                <ButtonLink
                  name={`${currentUser.first_name}'s followers`}
                  url={`/followers/${currentUser.user}`}
                  color='#a7a8ae'
                />
              </div>
            </div>
            <div id='location'>{currentUser.location}</div>
            {subscribed && followed && <div>{currentUser.contact}</div>}
            <div>{currentUser.description}</div>
            {currentUser.id !== customUser.id &&
              (subscribed && subscribed === true
                ? (
                  <div className='subscribe'>
                    <Button onClick={subscribe}>Unsubscribe</Button>
                  </div>
                  )
                : (
                  <div className='subscribe'>
                    <Button onClick={subscribe}>Subscribe</Button>
                  </div>
                  ))}
          </div>
        </div>
      )}
      <div id={'additional'}>
        {tags &&
          <List
              id={'list'}
              header={<div><strong>User tags</strong></div>}
            dataSource={tags}
            renderItem={item => (
            <List.Item>
              {item.name}
            </List.Item>
            )}
          />
        }
      </div>
    </div>
  )
}

export default UserInfo
