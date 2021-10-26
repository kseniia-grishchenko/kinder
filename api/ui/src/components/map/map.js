import React, {useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import Modal from "antd/es/modal/Modal";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';


const Map = ({}) => {
  const [address, setAddress] = React.useState("");
  const [setCustomUser] = useState();
  const [user, setUser] = useState();
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  });
  let [places, setPlaces] = useState([]);
  const [map, setMap] = React.useState(null)
  const google = window.google

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")) || null);
  }, []);

  useEffect(() => {
    if (user) {
      const getCustomUser = async () => {
        const {data: customUserFromDb} = await axios.get(
            `/custom-user/${user.id}/`
        );
        setCustomUser(customUserFromDb);
      };

      getCustomUser().catch((err) => console.log(err));
    }
  }, [user]);

  useEffect(() => {

    const currentUser = JSON.parse(localStorage.getItem("user")) || null;
    const getPlaces = async () => {
      const {data: places_from_db} = await axios.get(
          `/get-map/${currentUser.id}/`
      );
      const {favorite_places: favoritePlaces} = places_from_db;
      setPlaces(favoritePlaces.map(place => ({
        lat: Number(place[0]),
        lng: Number(place[1])
      })))
    };

    getPlaces().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    markPlaces();
  }, [places])

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const finish = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const {data: places_from_db} = await axios.post(
          `/update-map/${user.id}/`,
          {
            latitude: coordinates.lat,
            longitude: coordinates.lng
          },
          config
      );
      const {favorite_places: favoritePlaces} = places_from_db;
      setPlaces(favoritePlaces.map(place => ({
        lat: Number(place[0]),
        lng: Number(place[1])
      })))
      Modal.success({
        content: "User favorite places successfully updated",
      });
    } catch (error) {
      Modal.error({
        title: "Something went wrong",
        content: error.response.data.detail,
      });
    }
  };

  const containerStyle = {
    width: '400px',
    height: '400px'
  };

  const center = {
    lat: 50.4501,
    lng: 30.5234
  };

  const MyComponent = () => {
    const {isLoaded} = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "REACT_APP_GOOGLE_API_KEY"
    })
  }

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const markPlaces = () => {
    if(places) {
      places.forEach(place => {
       new google.maps.Marker({
        position: place,
        map,
        title: "Favorite place!",
      })
      })
    }
  }

    return (
        <div id={"main-info"}>
          <div>
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
            >
              {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                  <div>
                    <input {...getInputProps({placeholder: "Type address"})} />

                    <div>
                      {loading ? <div>Loading...</div> : null}

                      {suggestions.map(suggestion => {
                        const style = {
                          backgroundColor: suggestion.active ? "#64ceff" : "#fff"
                        };

                        return (
                            <div {...getSuggestionItemProps(suggestion, {style})}>
                              {suggestion.description}
                            </div>
                        );
                      })}
                    </div>
                    <Button type="primary" onClick={finish}>
                      Update place
                    </Button>
                  </div>
              )}
            </PlacesAutocomplete>
          </div>
          {/*<div>*/}
          {/*  User`s favorite places:*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  {places && places.map(place => <div>{place.lat} {place.lng}</div>)}*/}
          {/*</div>*/}
          <div>
            {{MyComponent} ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
            </GoogleMap>) : <div> Something wrong </div>}
          </div>
        </div>
    );
  }



export default Map;
