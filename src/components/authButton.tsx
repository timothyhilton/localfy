import { BrowserWindow } from "electron";
import { Button } from "./ui/button";

export default function AuthButton(){

    function startAuthFlow(){
        console.log("hi")
    }

    return (
        <Button onClick={startAuthFlow}>hi</Button>
    )
}