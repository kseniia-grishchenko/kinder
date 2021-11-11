import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UserImage from '../../components/image/image'
import './userInfo.css'
import ButtonLink from '../../components/button/button'
import { Button } from 'antd'
import isSubscribed from '../../helpers/isSubscribed'
import isFollowed from '../../helpers/isFollowed';
import { List, Typography, Divider } from 'antd';
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";

const UserInfo = ({ match }) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const customUser = JSON.parse(localStorage.getItem('customUser'))
  const [currentUser, setCurrentUser] = useState()
  const userId = match.params.id
  const [subscribed, setSubscribed] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [tags, setTags] = useState([])
  const [places, setPlaces] = useState([])
  const [map, setMap] = React.useState(null)
  const google = window.google

  useEffect(async () => {
    let cleanupFunction = false

    const getUser = async () => {
      const { data: userFromDb } = await axios.get(
        `/user/${userId}/`
      )

      const { data: userTags } = await axios.get(
          `/get-user-tags/${userId}/`
      )

      console.log(tags)

      if(isSubscribed(customUser?.id, userFromDb) && isFollowed(customUser?.id, userFromDb)) {
        const {data: userPlaces} = await  axios.get(`/get-user-place/${userId}/`)
        console.log(userPlaces)
        setPlaces(userPlaces)
      }

      setTags(userTags);
      setSubscribed(isSubscribed(customUser?.id, userFromDb))
      setFollowed(isFollowed(customUser?.id, userFromDb))

      if (!cleanupFunction) setCurrentUser(userFromDb)
    }

    getUser().catch((err) => console.log(err))

    return () => (cleanupFunction = true)
  }, [userId, subscribed])

  useEffect(() => {
    markPlaces()
  }, [places])

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

  const MapConnected = () => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'REACT_APP_GOOGLE_API_KEY'
    })
  }

  const onLoad = React.useCallback(function callback (map) {
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback (map) {
    setMap(null)
  }, [])

  const markPlaces = () => {
    places.forEach(place => {
      new google.maps.Marker({
        position: {
          lat: Number(place.latitude),
          lng: Number(place.longitude)
        },
        map,
        title: place.name
      })
    })
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
        <div>
          {tags && tags.length !== 0 ? (
            <List
                id={'list'}
                header={<div><strong>User tags</strong></div>}
              dataSource={tags}
              renderItem={item => (
              <List.Item>
                {item.name}
              </List.Item>
              )}
          /> ) : (
              <div style={{border: '1px solid', padding: '6px'}}>No tags</div>
          )}
        </div>
        <div id={'user-places'}>
        {{ MapConnected } && followed && subscribed
          && (
            <GoogleMap
              mapContainerStyle={
              {
              width: '800px',
              height: '400px'
              }
            }
              center={
                {
                  lat: 50.4501,
                  lng: 30.5234
                }
              }
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
            />)
         }
        </div>
      </div>
    </div>
  )
}

export default UserInfo
