import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Button } from 'antd'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { CloseCircleOutlined } from '@ant-design/icons'
import './map.css'

const Map = ({}) => {
  const [address, setAddress] = React.useState('')
  const [user, setUser] = useState()
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  })
  const [places, setPlaces] = useState([])
  const [map, setMap] = React.useState(null)
  const google = window.google

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')) || null)
  }, [])

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || null
    const getPlaces = async () => {
      const { data: places_from_db } = await axios.get(
          `/get-map/${currentUser.id}/`
      )
      const { favorite_places: favoritePlaces } = places_from_db
      setPlaces(favoritePlaces.map(place => ({
        lat: parseFloat(place[0]).toFixed(15),
        lng: parseFloat(place[1]).toFixed(15)
      })))
    }

    getPlaces().catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    markPlaces()
  }, [places])

  const handleSelect = async value => {
    const results = await geocodeByAddress(value)
    const latLng = await getLatLng(results[0])
    setAddress(value)
    setCoordinates(latLng)
  }

  const finish = async () => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    }
    try {
      const { data: places_from_db } = await axios.post(
          `/update-map/${user.id}/`,
          {
            latitude: coordinates.lat,
            longitude: coordinates.lng
          },
          config
      )
      const { favorite_places: favoritePlaces } = places_from_db
      setPlaces(favoritePlaces.map(place => ({
        lat: parseFloat(place[0]).toFixed(15),
        lng: parseFloat(place[1]).toFixed(15)
      })))
      alert('User favorite places successfully updated');
    } catch (error) {
      alert(error.response.data.detail)
    }
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
          lat: Number(place.lat),
          lng: Number(place.lng)
        },
        map,
        title: 'Favorite place!'
      })
    })
  }

  const deletePlace = async (index) => {
    const place = places[index]
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
        data: JSON.stringify({
          latitude: place.lat,
          longitude: place.lng
        })
      }
    }
    try {
      const { data: places_from_db } = await axios.delete(
          `/delete-map/${user.id}/`,
          config,
      )
      const { favorite_places: favoritePlaces } = places_from_db
      setPlaces(favoritePlaces.map(place => ({
        lat: parseFloat(place[0]).toFixed(15),
        lng: parseFloat(place[1]).toFixed(15)
      })))
      alert('Successfully deleted!');
    } catch (error) {
      alert(error.response.data.detail)
    }
    
  }

  return (
    <div id='map-info'>
      <div>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div id='input-place'>
              <div style={{margin: '0 50px'}}><strong>You can add your favorite places here(up to 5)</strong></div>
              <input {...getInputProps({ placeholder: 'Type address' })} />

              <div>
                {loading ? <div>Loading...</div> : null}

                {suggestions.map(suggestion => {
                  const style = {
                    backgroundColor: suggestion.active ? '#64ceff' : '#fff'
                  }

                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                  )
                })}
              </div>
              <Button type='primary' onClick={finish}>
                Add place
              </Button>
              {places.map((place, index) => (
                <div style={{display: 'flex', justifyContent: 'space-between'}} key={index}><div>Lat: {place.lat} lng: {place.lng}</div>
                <CloseCircleOutlined onClick={() => deletePlace(index)}/>
                </div>
              ))}
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      {/* <div> */}
      {/*  User`s favorite places: */}
      {/* </div> */}
      {/* <div> */}
      {/*  {places && places.map(place => <div>{place.lat} {place.lng}</div>)} */}
      {/* </div> */}
      <div>
        {{ MapConnected }
          ? (
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
          : <div> Something wrong </div>}
      </div>
    </div>
  )
}

export default Map
