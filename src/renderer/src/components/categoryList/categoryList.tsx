import { useTokenStore } from "@renderer/stores/tokenStore";
import PlaylistType from "@renderer/types/PlaylistType";
import { useEffect, useState } from "react";
import PlaylistList from "../playlist/playlistList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion"

export default function CategoryList(){
  const { token } = useTokenStore();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<PlaylistType[]>([]);

  useEffect(() => {
    async function fetchPlaylists(){
      const res = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
        Authorization: `Bearer ${token}`,
      }})
      if (!res.ok) {
        throw new Error('Failed to fetch playlists');
      }
      const data = await res.json();

      setPlaylists(data.items)
    }

    fetchPlaylists();
  }, [token])

  useEffect(() => {
    async function fetchSavedAlbums(){
      console.log(token)
      const res = await fetch('https://api.spotify.com/v1/me/albums', {
        headers: {
        Authorization: `Bearer ${token}`,
      }})
      if (!res.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await res.json();

      function mapApiResponse(apiResponse) {
        return apiResponse.items.map(item => {
          return {
            name: item.album.name,
            images: item.album.images.map(image => ({ url: image.url })),
            description: "",
            id: item.album.id,
            tracks: {
              href: item.album.tracks.href,
              total: item.album.tracks.total
            }
          }
        })
      }
      
      const mappedResponse = mapApiResponse(data)

      setSavedAlbums(mappedResponse)
    }

    fetchSavedAlbums();
  }, [token])

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