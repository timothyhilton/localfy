import { Button } from "./ui/button";

export default function AuthButton(){

    function startAuthFlow(){
        window.myAPI.consolelog("hi!")
    }

    return (
        <Button onClick={startAuthFlow}>hi</Button>
    )
}