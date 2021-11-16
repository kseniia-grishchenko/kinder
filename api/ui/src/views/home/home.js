import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './home.css'
import UserCard from '../../components/userCard/userCard'
import { Input } from 'antd';

const Home = () => {
  const [users, setUsers] = useState([])
  const [text, setText] = useState("");
  const user = JSON.parse(localStorage.getItem('user'))

    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user?.token}`
      }
  }

  useEffect(() => {
    const getUsers = async () => {
      const { data: usersFromDb } = await axios.get(
        '/users/',
          config
      )
      user
        ? setUsers(usersFromDb.filter((user) => user.user !== user.id))
        : setUsers(usersFromDb)
    }

    getUsers().catch((err) => console.log(err))
  }, [])

    useEffect(() => {
        if(user === null) {
            setUsers([])
        }
    }, [user])

    const onSearchHandler = async (text) =>{
      setText(text);
      if(text === '') {
          const { data: usersFromDb } = await axios.get(
            '/users/',
              config
          )
          setUsers((usersFromDb))
          return
      }
    if(text.length > 3){
        const { data: suggested_users } = await axios.get(
          `/users/${text}`,
            config
        )
        setUsers(suggested_users);
    }

}

  return (
    <div>
        <div style={{padding: '10px 50px'}}>
            <Input placeholder="input search text"
                   onChange={e => {onSearchHandler(e.target.value)}}
                   value={text}
                   onBlur={() => {
                    setTimeout(() => {
                        setUsers([])
                    }, 25)
                }}
            />
        </div>
      <div id='users'>
        {users?.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  )
}

export default Home
