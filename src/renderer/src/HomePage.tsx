import { useEffect, useState } from 'react';
import Settings from './components/settings/settings';
import CategoryList from './components/categoryList/categoryList';
import { useLastListenedLengthStore } from './stores/lastListenedLength';
import { callSpotifyApi } from './components/api-util';

interface userInfo {
    display_name: string;
}

export default function HomePage() {
    const [user, setUserInfo] = useState<userInfo>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await callSpotifyApi("v1/me")
                
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchUserInfo();
    }, []);

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
