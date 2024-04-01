import { useState } from 'react'
import { Button } from './components/ui/button';
import AuthButton from './components/authButton';
// { isLoggedIn, token }: { isLoggedIn: boolean, token: string | undefined }
function App() {
  const isLoggedIn = false;

  if(isLoggedIn){

  } else {
    return(
      <div className="font-bold flex flex-row min-h-screen justify-center items-center">
        <AuthButton />
      </div>
    )
  }
}

export default App
