import { useTokenStore } from "@renderer/stores/tokenStore";
import { useEffect, useState } from "react";
import { useLastListenedLengthStore } from "@renderer/stores/lastListenedLength";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion"
import Track, { TrackContainer } from "@renderer/types/Tracks";
import TrackContainerList from "../trackContainers/trackContainerList";
import LastListenedList from "../trackContainers/lastListenedList";
import { callSpotifyApi } from "../api-util";

export default function CategoryList(){
  const { token } = useTokenStore();
  const { length } = useLastListenedLengthStore();
  const [playlists, setPlaylists] = useState<TrackContainer[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<TrackContainer[]>([]);
  const [lastListened, setLastListened] = useState<TrackContainer>();

  useEffect(() => {
    async function fetchPlaylists() {
      const data = await callSpotifyApi("v1/me/playlists", token)
      
      const mappedPlaylists: TrackContainer[] = data.items.map((playlist: any) => ({
        name: playlist.name,
        id: playlist.id,
        type: 'playlist',
        imageUrl: (playlist.images && playlist.images[0] && playlist.images[0].url) || '',
        trackListHref: playlist.tracks.href,
        trackCount: playlist.tracks.total,
      }));
  
      setPlaylists(mappedPlaylists);
    }
  
    fetchPlaylists();
  }, [token]);

  useEffect(() => {
    async function fetchSavedAlbums() {
      const data = await callSpotifyApi("v1/me/albums", token)
  
      const mappedAlbums: TrackContainer[] = data.items.map((item: any) => {
        const mappedTracks: Track[] = item.album.tracks.items.map((track: any) => ({
          name: track.name,
          artists: track.artists.map((artist: any) => artist.name),
          album: item.album.name,
          id: track.id,
          coverArtUrl: (item.album.images && item.album.images[0] && item.album.images[0].url) || '',
        }));
  
        return {
          name: item.album.name,
          id: item.album.id,
          type: 'album',
          imageUrl: (item.album.images && item.album.images[0] && item.album.images[0].url) || '',
          trackListHref: item.album.tracks.href,
          trackCount: item.album.total_tracks,
          tracks: mappedTracks,
        }
      })
  
      setSavedAlbums(mappedAlbums);
    }
  
    fetchSavedAlbums();
  }, [token]);

  useEffect(() => {
    async function fetchLastListened() {
      if(!length) {return}
      
      const data = await callSpotifyApi(`v1/me/player/recently-played?limit=${length}`, token)
  
      const mappedTracks: Track[] = data.items.map((item: any) => ({
        name: item.track.name,
        artists: item.track.artists.map((artist: any) => artist.name),
        album: item.track.album.name,
        id: item.track.id,
        coverArtUrl: (item.track.album.images && item.track.album.images[0] && item.track.album.images[0].url) || '',
      }));
  
      const lastListenedContainer: TrackContainer = {
        name: "Recently Played",
        id: "recently-played",
        type: 'lastlistened',
        imageUrl: (mappedTracks && mappedTracks[0] && mappedTracks[0].coverArtUrl) || '',
        trackListHref: data.href,
        trackCount: mappedTracks.length,
        tracks: mappedTracks,
      };
  
      setLastListened(lastListenedContainer);
    }
  
    fetchLastListened();
  }, [token, length]);

  return (
    <Accordion type="single" collapsible className="m-4 px-4 rounded-lg bg-slate-50 border dark:bg-slate-900">

      <AccordionItem value="item-1">
        <AccordionTrigger>Playlists</AccordionTrigger>
        <AccordionContent>
          <TrackContainerList trackContainers={playlists}/>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Saved Albums</AccordionTrigger>
        <AccordionContent>
          <TrackContainerList trackContainers={savedAlbums}/>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <LastListenedList lastListenedContainer={lastListened} />
      </AccordionItem>
      
    </Accordion>
  )
}