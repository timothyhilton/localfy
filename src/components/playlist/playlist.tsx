import PlaylistType from "@/types/PlaylistType"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import StatusButton from "./statusButton"
import DownloadButton from "./downloadButton"

type playlistArgs = {
    index: number
    playlist: PlaylistType
}

export default function Playlist({ index, playlist }: playlistArgs){

    return(
        <Card className="h-[100px] w-[20rem]]" tabIndex={index}>
            <CardHeader>
                <div className="flex flex-row">
                    
                    {playlist.images ?
                        <img src={playlist.images[0].url} className="w-[4rem] h-[4rem] mt-[-0.4rem] ml-[-0.4rem] mr-4"></img>
                        :
                        <img src="./nocover.png" className="w-[4rem] h-[4rem] mt-[-0.4rem] ml-[-0.4rem] mr-4"></img>
                    }
                    
                    <div className="flex flex-col truncate ml-1">
                        <CardTitle className="text-lg">
                            {playlist.name}
                        </CardTitle>
                        <StatusButton />
                    </div>
                    <DownloadButton onClick={() => window.ipcRenderer.send("startBackup", playlist.id)}/>
                </div>
            </CardHeader>
        </Card>
    )
}