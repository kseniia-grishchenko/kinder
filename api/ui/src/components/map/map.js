import React, {useEffect, useState} from "react";
import axios from "axios";
import { Button } from "antd";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import Modal from "antd/es/modal/Modal";

const Map = ({  }) => {
  const [address, setAddress] = React.useState("");
  const [customUser, setCustomUser] = useState();
  const [user, setUser] = useState();
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")) || null);
  }, []);

  useEffect(() => {
    if (user) {
      const getCustomUser = async () => {
        const { data: customUserFromDb } = await axios.get(
          `/custom-user/${user.id}/`
        );
        setCustomUser(customUserFromDb);
      };

      getCustomUser().catch((err) => console.log(err));
    }
  }, [user]);

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const Finish = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
  console.log("лалалалалалалаллалалаллалаллаал")
    try {
      await axios.post(
        `/update-map/${user.id}/`,
        {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        },
        config
      );
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

  return (
      <div id={"main-info"}>
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>

            <input {...getInputProps({ placeholder: "Type address" })} />

            <div>
              {loading ? <div>Loading...</div> : null}

              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? "#64ceff" : "#fff"
                };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div >
            <Button type="primary" onClick={Finish}>
              Update place
            </Button>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
      </div>
  );
}

export default Map;