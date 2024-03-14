import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  function changeCount(){
    setCount(count + 1);
  }

  return (
    <div className="font-bold">
      hello {count}
      <button onClick={changeCount}>update count</button>
    </div>
  )
}

export default App
