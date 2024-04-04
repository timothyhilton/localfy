import { useEffect, useState } from 'react'
import { Button } from './components/ui/button';
import AuthButton from './components/authButton';
import { ipcRenderer } from 'electron';

// { isLoggedIn, token }: { isLoggedIn: boolean, token: string | undefined }
function LoginScreen() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Listen for the message from the main process
    const handleMessage = (_event: any, token: string) => {
      console.log(token); // Outputs: 'Hello from the main process!'
      // You can update your component state or perform any other actions here
    };

    ipcRenderer.on('set-token', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      ipcRenderer.removeListener('set-token', handleMessage);
    };
  }, []);

  if(token){
    return(
      <div> yay!! </div>
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
