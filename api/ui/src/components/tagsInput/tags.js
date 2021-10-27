import React, {useEffect, useState} from 'react';
import axios from "axios";
import {CloseCircleOutlined} from "@ant-design/icons";
import './tags.css'

const TagsInput = () => {
  const [tags, setTags] = useState([]);
  const [userTags, setUserTags] = useState();
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    getUserTags().catch((err) => console.log(err))
    getTags().catch((err) => console.log(err))
  }, [])

  const getTags = async () => {
      const { data: tags_from_db } = await axios.get(
        '/get-all-tags/'
      )
        setTags(tags_from_db)
    }

  const getUserTags = async () => {
      const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
      }
      try {
          const {data: user_tags_from_db} = await axios.get(
              `/get-user-tags/${user.id}/`,
              config,
          )
          setUserTags(user_tags_from_db);
      } catch (error) {
          alert(error.response.data.detail)
      }
  }

  const removeTag = async (tag_id) => {
      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${user.token}`
          }
      }
      try {
          const {data: tags_from_db} = await axios.delete(
              `/delete-tag/${tag_id}/`,
              config,
          )
          setTags(tags_from_db);
          alert('Successfully deleted!');
      } catch (error) {
          alert(error.response.data.detail)
      }
  }

  const addTag = async (tag_name) => {
      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${user.token}`
          }
      }
      try {
          const {data: tags_from_db} = await axios.post(
              `/add-tag/${user.id}/`,
              {tag_name: tag_name},
              config,
          )
          setTags(tags_from_db);
          alert('Successfully added!');
      } catch (error) {
          alert(error.response.data.detail)
      }
  }

  const onSuggestHandler = (text) => {
      setText(text);
      addTag(text);
      setSuggestions([]);
  }

  const onChangeHandler = (text) =>{
      let matches = []
      if(text.length>0){
          matches = tags.filter(tag => {
              const regex = new RegExp(`${text}`,"gi");
              return tag.name.match(regex);
          })
      }
      setSuggestions(matches);
      setText(text);
  }

    return (
        <div>
          <div className="container">
            Hobbies:
            <input type="text"
                   className="col-md-10 input"
                   style={{marginTop: 10}}
                   onChange={e => {onChangeHandler(e.target.value)}}
                   value={text}
                   onBlur={() => {
                       setTimeout(() => {
                           setSuggestions([])
                       }, 25);
                   }}
            />
              {suggestions && suggestions.map((suggestion, i) =>
              <div key={i} className="suggestion col-md-10 justify-content-md-center"
                   onClick={()=>onSuggestHandler(suggestion.name)}>
                  {suggestion.name}
              </div>)}
          </div>
          {userTags && userTags.map(tag => (
            <div style={{display: 'flex', justifyContent: 'space-around'}} key={tag.id}><div>{tag.name}</div>
            <CloseCircleOutlined onClick={() => removeTag(tag.id)}/>
            </div>
          ))}
        </div>
    )
}


export default TagsInput;