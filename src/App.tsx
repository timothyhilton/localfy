import { useState } from 'react'
import { Button } from './components/ui/button';
import AuthButton from './components/authButton';

function App() {
  const [count, setCount] = useState(0)

  function changeCount(){
    setCount(count + 1)
    console.log("hi")
  }
  
  function redirect(){
    window.location.href = "https://accounts.spotify.com/authorize?response_type=token&client_id=d79bd243868b499886a6a3adc26d4d65&scope=playlist-read-private%20playlist-read-collaborative&redirect_uri=fyfy%3A%2F%2Fredirect&state=test"
  }

  return (
    <div className="font-bold">
      hello {count}
      <Button onClick={changeCount}>update count</Button>
      <Button onClick={redirect}>login with spotify</Button>
    </div>
  )
}

export default App
