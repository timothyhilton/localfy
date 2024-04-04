import { useEffect, useState } from "react";

type Playlist = {
    name: string;
    // Add other properties if needed
};

export default function HomePage({ token }: {token: string}) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch playlists');
                }
                const data = await response.json();
                setPlaylists(data.items); // Assuming the playlists are nested under the 'items' key
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, [token]);

    return(
        <>
            hi!! {token}
            {playlists.map((playlist, index) => (
                <p key={index}>{playlist.name}</p>
            ))}
        </>
    )
}