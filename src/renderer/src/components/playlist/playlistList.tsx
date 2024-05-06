import PlaylistType from "@renderer/types/PlaylistType";
import Playlist from "./playlist";

export default function PlaylistList({ playlists }: { playlists: PlaylistType[] }) {
    return(
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mx-auto lg:mx-[10%]">
            {playlists.map((playlist, index) => {
                return(
                    <Playlist index={index} key={index} playlist={playlist}/>
                )
            })}
        </div>
    )
}