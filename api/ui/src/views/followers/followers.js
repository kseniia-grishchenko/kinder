import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UserCard from '../../components/userCard/userCard'
import './followers.css'

const Followers = ({ match }) => {
  const [followers, setFollowers] = useState([])
  const userId = match.params.id

  useEffect(() => {
    let cleanupFunction = false

    const getFollowers = async () => {
      const { data: userFollowers } = await axios.get(
        `/followers/${userId}/`
      )
      if (!cleanupFunction) setFollowers(userFollowers)
    }

    getFollowers().catch((err) => console.log(err))

    return () => (cleanupFunction = true)
  }, [userId])

  return (
    <div id='followers'>
      {followers?.map((follower) => (
        <UserCard user={follower} key={follower.id} />
      ))}
    </div>
  )
}

export default Followers
