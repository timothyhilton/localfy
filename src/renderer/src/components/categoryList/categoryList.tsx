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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { Button } from "../ui/button";
import { DownloadMenu } from "../download-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog"

export default function CategoryList(){
  const { token } = useTokenStore();
  const { length } = useLastListenedLengthStore();
  const [playlists, setPlaylists] = useState<TrackContainer[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<TrackContainer[]>([]);
  const [lastListened, setLastListened] = useState<TrackContainer>();

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
      const res = await fetch('https://api.spotify.com/v1/me/albums', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await res.json();
  
      const mappedAlbums: TrackContainer[] = data.items.map((item: any) => {
        const mappedTracks: Track[] = item.album.tracks.items.map((track: any) => ({
          name: track.name,
          artists: track.artists.map((artist: any) => artist.name),
          album: item.album.name,
          id: track.id,
          coverArtUrl: item.album.images[0]?.url || '',
        }));
  
        return {
          name: item.album.name,
          id: item.album.id,
          type: 'album',
          imageUrl: item.album.images[0]?.url || '',
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
      const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch recently played tracks');
      }
      const data = await res.json();
  
      const mappedTracks: Track[] = data.items.map((item: any) => ({
        name: item.track.name,
        artists: item.track.artists.map((artist: any) => artist.name),
        album: item.track.album.name,
        id: item.track.id,
        coverArtUrl: item.track.album.images[0]?.url || '',
      }));
  
      const lastListenedContainer: TrackContainer = {
        name: "Recently Played",
        id: "recently-played",
        type: 'lastlistened',
        imageUrl: mappedTracks[0]?.coverArtUrl || '',
        trackListHref: data.href,
        trackCount: mappedTracks.length,
        tracks: mappedTracks,
      };
      console.log(lastListenedContainer)
  
      setLastListened(lastListenedContainer);
    }
  
    fetchLastListened();
  }, [token]);

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
        <div className="flex flex-1 items-center justify-between py-4 font-medium transition-all">

          <span className="flex flex-row">
            Last {length} Listened to Songs
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="ml-1 mt-[0.05]"><svg xmlns="http://www.w3.org/2000/svg" className="ml-1 mt-[0.05rem]" width="15" height="15" viewBox="0 0 29.536 29.536"><path d="M14.768 0C6.611 0 0 6.609 0 14.768c0 8.155 6.611 14.767 14.768 14.767s14.768-6.612 14.768-14.767C29.535 6.609 22.924 0 14.768 0zm0 27.126c-6.828 0-12.361-5.532-12.361-12.359 0-6.828 5.533-12.362 12.361-12.362 6.826 0 12.359 5.535 12.359 12.362s-5.533 12.359-12.359 12.359z"/><path d="M14.385 19.337c-1.338 0-2.289.951-2.289 2.34 0 1.336.926 2.339 2.289 2.339 1.414 0 2.314-1.003 2.314-2.339-.027-1.389-.928-2.34-2.314-2.34zM14.742 6.092c-1.824 0-3.34.513-4.293 1.053l.875 2.804c.668-.462 1.697-.772 2.545-.772 1.285.027 1.879.644 1.879 1.543 0 .85-.67 1.697-1.494 2.701-1.156 1.364-1.594 2.701-1.516 4.012l.025.669h3.42v-.463c-.025-1.158.387-2.162 1.311-3.215.979-1.08 2.211-2.366 2.211-4.321 0-2.135-1.566-4.011-4.963-4.011z"/></svg></TooltipTrigger>
                <TooltipContent>
                  <p>
                    Backup your recently played songs here,<br />
                    adjust the number of songs in the settings menu.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="mt-[-0.7rem] mb-[-5rem] ml-3 space-x-2 flex flex-row">
              {lastListened ? 
                <DownloadMenu lighter={true} trackContainer={lastListened} /> 
                : 
                <></>
              }
            </span>
            <Dialog>
              <DialogTrigger><Button variant="outline" className="ml-1 mt-[-0.45rem] mb-[-5rem]">see list</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your Last {length} Listened to Songs</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <Accordion type="single" collapsible className="mt-[-0.4rem] max-h-[25rem] overflow-scroll m-4 px-4 rounded-lg  border dark:bg-slate-900">
                    {lastListened?.tracks?.map((track, index) => (
                        <AccordionItem key={index} value={index.toString()}>
                          <div className="my-2 flex flex-row">
                            {index + 1 + "."}
                            <img src={track.coverArtUrl} className="h-6 ml-3 mr-2" />
                            {track.name}
                          </div>
                        </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </DialogContent>
            </Dialog>
            
          </span>

        </div>
      </AccordionItem>
      
    </Accordion>
  )
}