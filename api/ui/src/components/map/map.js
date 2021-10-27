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
      const { data: placesFromDb } = await axios.get(
          `/get-user-place/${currentUser.id}/`
      )
      setPlaces(placesFromDb);
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
      const { data: placesFromDb } = await axios.post(
          `/add-user-place/${user.id}/`,
          {
            name: address,
            latitude: coordinates.lat,
            longitude: coordinates.lng
          },
          config
      )
      setPlaces(placesFromDb)
      alert('User favorite places successfully updated');
    } catch (error) {
      alert(error.response.data.detail || error)
    }
  }

    const deletePlace = async (place_id) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      }
    }
    try {
      const { data: placesFromDb } = await axios.delete(
          `/delete-user-place/${place_id}/`,
          config,
      )
      setPlaces(placesFromDb)
      alert('Successfully deleted!');
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
          lat: Number(place.latitude),
          lng: Number(place.longitude)
        },
        map,
        title: 'Favorite place!'
      })
    })
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
              {places && places.map((place) => (
                <div style={{display: 'flex', justifyContent: 'space-between'}} key={place.id}><div>{place.name}</div>
                <CloseCircleOutlined onClick={() => deletePlace(place.id)}/>
                </div>
              ))}
            </div>
          )}
        </PlacesAutocomplete>
      </div>
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
