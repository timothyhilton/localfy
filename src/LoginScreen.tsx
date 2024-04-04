import { useEffect, useState } from 'react'
import { Button } from './components/ui/button';
import AuthButton from './components/authButton';

// { isLoggedIn, token }: { isLoggedIn: boolean, token: string | undefined }
function LoginScreen() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const handleMessage = (_event: any, token: string) => {
      console.log(token);
      setToken(token)
    };

    window.ipcRenderer.on('set-token', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.ipcRenderer.removeListener('set-token', handleMessage);
    };
  }, []);

  if(token){
    return(
      <>
        
      </>
    )
  } else {
    return(
      <div className="font-bold flex flex-row min-h-screen justify-center items-center">
        <AuthButton />
      </div>
    )
  }
}

export default LoginScreen
