import { useEffect, useState } from 'react';
import { useTokenStore } from './stores/tokenStore.ts';
import Playlist from './components/playlist/playlist.tsx';
import PlaylistType from './types/PlaylistType.ts'
import PlaylistList from './components/playlist/playlistList.tsx';

interface userInfo {
    display_name: string;
}

export default function HomePage() {
    const { token } = useTokenStore();
    const [user, setUserInfo] = useState<userInfo>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchUserInfo();
    }, [token]);

    return(
        <div className="flex flex-col">
            <h1 className="text-4xl font-bold mx-auto my-[3rem]">Welcome back, {user?.display_name}</h1>
            <PlaylistList />
        </div>
    )
}
