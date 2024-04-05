import PlaylistType from "@/types/PlaylistType"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import StatusButton from "./statusButton"

type playlistArgs = {
    index: number
    playlist: PlaylistType
}

export default function Playlist({ index, playlist }: playlistArgs){
    return(
        <Card className="h-[100px]">
            <CardHeader>
                <div className="flex flex-row">
                    <img src={playlist.images[0].url} className="w-[4rem] h-[4rem] mt-[-0.4rem] ml-[-0.4rem] mr-4"></img>
                    <div className="flex flex-col">
                        <CardTitle className="text-lg my-auto [&:not(:hover)]:truncate">
                            {playlist.name}
                        </CardTitle>
                        <StatusButton />
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}