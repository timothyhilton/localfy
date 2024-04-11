import { useTokenStore } from "@renderer/stores/tokenStore";
import PlaylistType from "@renderer/types/PlaylistType";
import { useEffect, useState } from "react";
import Playlist from "./playlist";

export default function PlaylistList() {
    const { token } = useTokenStore();
    const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

    useEffect(() => {

        async function fetchPlaylists(){

            const res = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch playlists');
            }
            const data = await res.json();

            (data.items as Array<any>).forEach(playlist => {
                console.log(playlist.tracks);
            });

            setPlaylists(data.items)

        };

        fetchPlaylists();
    }, [token]);

    return(
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mx-auto lg:mx-[10%]">
            {playlists.map((playlist, index) => {
                return(
                    <Playlist index={index} playlist={playlist}/>
                )
            })}
        </div>
    )
}