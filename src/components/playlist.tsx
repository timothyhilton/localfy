import PlaylistType from "@/types/PlaylistType"

type playlistArgs = {
    index: number
    playlist: PlaylistType
}

export default function Playlist({ index, playlist }: playlistArgs){
    return(
        <p key={index}>{playlist.name} <img className="w-10 h-10" src={playlist.images[0].url}></img></p>
    )
}