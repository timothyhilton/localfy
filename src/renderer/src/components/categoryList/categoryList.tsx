import { useTokenStore } from "@renderer/stores/tokenStore";
import { useEffect, useState } from "react";
import PlaylistList from "../playlist/playlistList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion"
import { TrackContainer } from "@renderer/types/Tracks";

export default function CategoryList(){
  const { token } = useTokenStore();
  const [playlists, setPlaylists] = useState<TrackContainer[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<TrackContainer[]>([]);

  useEffect(() => {
    async function fetchPlaylists() {
      const res = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch playlists');
      }
      const data = await res.json();
  
      const mappedPlaylists: TrackContainer[] = data.items.map((playlist: any) => ({
        name: playlist.name,
        id: playlist.id,
        type: 'playlist',
        imageUrl: playlist.images[0]?.url || '',
        trackListHref: playlist.tracks.href,
        trackCount: playlist.tracks.total,
      }));
  
      setPlaylists(mappedPlaylists);
    }
  
    fetchPlaylists();
  }, [token]);

  useEffect(() => {
    async function fetchSavedAlbums() {
      console.log(token);
      const res = await fetch('https://api.spotify.com/v1/me/albums', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await res.json();
  
      const mappedAlbums: TrackContainer[] = data.items.map((item: any) => ({
        name: item.album.name,
        id: item.album.id,
        type: 'album',
        imageUrl: item.album.images[0]?.url || '',
        trackListHref: item.album.tracks.href,
        trackCount: item.album.total_tracks,
      }));
  
      setSavedAlbums(mappedAlbums);
    }
  
    fetchSavedAlbums();
  }, [token]);

  return (
    <Accordion type="single" collapsible className="m-4 px-4 rounded-lg bg-slate-50 border dark:bg-slate-900">
      <AccordionItem value="item-1">
        <AccordionTrigger>Playlists</AccordionTrigger>
        <AccordionContent>
          <PlaylistList playlists={playlists}/>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Saved Albums</AccordionTrigger>
        <AccordionContent>
          <PlaylistList playlists={savedAlbums}/>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}