import React, { useEffect, useState } from 'react'
import axios from 'axios';

const App = () => {

  const [jokes, setJokes] = useState([])

  useEffect(()=>{
    axios.get('/api/lamejokes/jokes')
    .then((responce)=>{
      console.log(responce)
      setJokes(responce.data)
    })
    .catch((error)=>{
      console.log(error)
    })
  },[])

  return (
    <div>
      <h1>connect front end back</h1>
      <p>Jokes: {jokes.length}</p>
      {
        jokes.map((joke, index)=>(
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))
      }
      </div>
  )
}

export default App