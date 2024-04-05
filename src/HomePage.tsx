import { useEffect, useState } from 'react';
import { useTokenStore } from './stores/tokenStore.ts';
import Playlist from './components/playlist.tsx';
import PlaylistType from './types/PlaylistType.ts'
import PlaylistList from './components/playlistList.tsx';

export default function HomePage() {
    return(
        <>
            <PlaylistList />
        </>
    )
}
