import PlaylistType from "@/types/PlaylistType"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"

type playlistArgs = {
    index: number
    playlist: PlaylistType
}

export default function Playlist({ index, playlist }: playlistArgs){
    return(
        <Card className="h-[100px]">
            <CardHeader>
                <CardTitle>{playlist.name}</CardTitle>
                <CardDescription>{playlist.description}</CardDescription>
            </CardHeader>
        </Card>
    )
}