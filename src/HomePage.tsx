import { useEffect, useState } from 'react';
import { useTokenStore } from './stores/tokenStore.ts';
import Playlist from './components/playlist.tsx';
import PlaylistType from './types/PlaylistType.ts'

export default function HomePage() {
  const { token } = useTokenStore();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <>
      hi!! {token}
      {playlists.map((playlist, index) => (
        <Playlist index={index} playlist={playlist}/>
      ))}
    </>
  );
}
