import { Button } from "./ui/button";

export default function AuthButton(){

    function startAuthFlow(){
        window.ipcRenderer.send("openExternal", "https://accounts.spotify.com/authorize?response_type=token&client_id=d79bd243868b499886a6a3adc26d4d65&scope=playlist-read-private%20playlist-read-collaborative&redirect_uri=fyfy%3A%2F%2Fredirect&state=test")
    }

    return (
        <Button onClick={startAuthFlow}>hi</Button>
    )
}