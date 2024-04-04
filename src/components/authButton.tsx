import { Button } from "./ui/button";

export default function AuthButton(){

    function startAuthFlow(){
        window.ipcRenderer.send("startAuthFlow")
    }

    return (
        <Button onClick={startAuthFlow}>Sign in With Spotify</Button>
    )
}