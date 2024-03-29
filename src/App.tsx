import { useState } from 'react'
import { Button } from './components/ui/button';
import AuthButton from './components/authButton';

function App() {
  const [count, setCount] = useState(0)

  function changeCount(){
    setCount(count + 1)
    console.log("hi")
  }
  
  return (
    <div className="font-bold">
      hello {count}
      <Button onClick={changeCount}>update count</Button>
      <AuthButton />
    </div>
  )
}

export default App
