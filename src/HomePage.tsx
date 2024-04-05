import { useEffect, useState } from 'react';
import { useTokenStore } from './stores/tokenStore.ts';
import Playlist from './components/playlist.tsx';
import PlaylistType from './types/PlaylistType.ts'
import PlaylistList from './components/playlistList.tsx';

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
        <div className="flex flex-col space-y-10">
            <h1 className="text-4xl font-bold m-auto mt-[3rem]">Welcome back, {user?.display_name}</h1>
            <PlaylistList />
        </div>
    )
}
