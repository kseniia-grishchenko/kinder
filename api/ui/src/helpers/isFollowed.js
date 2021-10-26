import React from 'react'

const isFollowed = (id, user) => {
  return user.subscriptions.includes(id)
}

export default isFollowed
