import React, { useEffect, useState } from 'react'
import axios from 'axios';


const App = () => {
  const [jokes, setJokes] = useState([])
  const [user, setUser] = useState([])

  const handleClick = ()=>{
    axios.get('/api/user')
    .then((response)=>{
      setUser(response.data)
      console.log(response.data)
    })
    .catch((error)=>{
      console.log("there is an " + error)
    })
  }

  const handleClose = ()=>{
    setUser([])
  }

  useEffect(()=>{
    axios.get('/api/jokes')
    .then((response)=>{
      setJokes(response.data)
    })
    .catch((error)=>{
      console.log("there is an error"+ error)
    })
  },[])


  return (
    <div>
      <div>
        <button onClick={handleClick}>GET USERS</button>
        <button onClick={handleClose}>Hide</button>
        {
          user.map((data)=>(
            <div key={data.id}>
              <h1>{data.name}</h1>
              <h3>{data.proffession}</h3>
            </div>
            ))
        }
      </div>
      <h1>Api Jokes</h1>
      <p>jokes: {jokes.length}</p>
      {
        jokes && jokes.length ?
          jokes.map((joke)=>
          <div key={joke.id}>
            <h1>{joke.title}</h1>
            <p>{joke.content}</p>
          </div> )
         : null
      }

    </div>
  )
}

export default App
