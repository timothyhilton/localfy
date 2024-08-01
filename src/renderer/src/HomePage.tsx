import { useEffect, useState } from 'react';
import { useTokenStore } from '@renderer/stores/tokenStore';
import PlaylistList from '@renderer/components/trackContainers/trackContainerList';
import Settings from './components/settings/settings';
import CategoryList from './components/categoryList/categoryList';
import { useLastListenedLengthStore } from './stores/lastListenedLength';

interface userInfo {
    display_name: string;
}

export default function HomePage() {
    const { token } = useTokenStore();
    const [user, setUserInfo] = useState<userInfo>();
    const { length } = useLastListenedLengthStore();

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

    useEffect(() => {
        window.api.getSetting('lastListenedLength').then(value => useLastListenedLengthStore.setState({ length: value }))
    }, [])

    return(
        <div className="flex flex-col">
            <h1 className="text-4xl font-bold mx-auto mt-[3rem] mb-[2rem]">Welcome back, {user?.display_name}.</h1>
            <CategoryList />
            <Settings />
        </div>
    )
}
