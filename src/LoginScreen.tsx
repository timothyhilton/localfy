// LoginScreen.tsx
import { useEffect } from 'react';
import { useTokenStore } from './stores/tokenStore.ts';
import AuthButton from './components/authButton';
import HomePage from './HomePage.tsx';

function LoginScreen() {
  const { token } = useTokenStore();

  useEffect(() => {
    const handleMessage = (_event: any, token: string) => {
      console.log(token);
      useTokenStore.getState().setToken(token);
    };

    window.ipcRenderer.on('set-token', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.ipcRenderer.removeListener('set-token', handleMessage);
    };
  }, []);

  if (token) {
    return <HomePage />;
  } else {
    return (
      <div className="font-bold flex flex-row min-h-screen justify-center items-center">
        <AuthButton />
      </div>
    );
  }
}

export default LoginScreen;