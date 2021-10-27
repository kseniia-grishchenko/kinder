import React from 'react'

const isSubscribed = (id, user) => {
  return user.followers.includes(id)
}

export default isSubscribed
