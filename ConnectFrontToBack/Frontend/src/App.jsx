import React, { useEffect, useState } from 'react'
import axios from 'axios';


const App = () => {
  const [jokes, setJokes] = useState([])

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
