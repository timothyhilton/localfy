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

  return (
    <PlaylistList playlists={playlists}/>
  )
}