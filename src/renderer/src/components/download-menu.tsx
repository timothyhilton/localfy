import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import DownloadButton from '@renderer/components/trackContainers/downloadButton'
import { useEffect, useState } from 'react'
import { useTokenStore } from '@renderer/stores/tokenStore'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Progress } from "@renderer/components/ui/progress"
import Track, { TrackContainer } from '@renderer/types/Tracks'

export function DownloadMenu({ trackContainer }: { trackContainer: TrackContainer }): JSX.Element {
  const { token } = useTokenStore()
  const [open, setOpen] = useState(false)
  const [logMessages, setLogMessages] = useState<String[]>([])
  const [progress, setProgress] = useState<number>();

  async function startBackup(): Promise<void> {
    if (trackContainer.trackCount < 1) {
      return
    }

    if (trackContainer.type == 'album') {
      window.api.startBackup({ tracks: trackContainer.tracks, folderName: trackContainer.name })
    }

    if (trackContainer.type == 'playlist') {
      try {
        const res = await fetch(trackContainer.trackListHref, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        })
    
        if (!res.ok) {
            throw new Error(`Failed to fetch tracks for playlist ${trackContainer.name}`)
        }
    
        const data = await res.json();
    
        const mappedTracks: Track[] = data.items.map((item: any) => {
            const track = item.track || item;
            return {
                name: track.name,
                artists: track.artists.map((artist: any) => artist.name),
                album: track.album.name,
                id: track.id,
                coverArtUrl: track.album.images[0]?.url || '',
            };
        });
        window.api.startBackup({ tracks: mappedTracks, folderName: trackContainer.name });
      } catch (error) {
        console.error('Error fetching tracks for playlist:', error)
      }
    }
  }

  let isThereAlreadyAnEventHandler = false
  useEffect(() => {
    const handleLog = (data: { message: string, progress?: number, folderName: string }): void => {
      if(data.folderName != trackContainer.name) { return }

      setLogMessages(logMessages => [...logMessages, data.message])
      if(data.progress) {setProgress(data.progress)}
    }

    if(!isThereAlreadyAnEventHandler){ 
      window.api.onDownloadLog(handleLog)
      isThereAlreadyAnEventHandler = true
    }
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DownloadButton onClick={() => setOpen(!open)} />
      </SheetTrigger>
      <SheetContent side="left" className="space-y-3">
        <SheetHeader className="space-y-[0rem]">
          <SheetTitle className="text-3xl">{trackContainer.name}</SheetTitle>
          <SheetDescription>{trackContainer.id}</SheetDescription>
        </SheetHeader>

        {/* this is a placeholder for now */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="">
              Folder
            </Label>
            <Input id="name" placeholder="none" className="col-span-3 hover:cursor-default" readOnly/>
          </div>
        </div>

        <SheetFooter>
          <Button className="w-full" onClick={() => startBackup()}>
            Start backup
          </Button>
        </SheetFooter>

        <div className="rounded-md border p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Progress</h4>
          <Progress className="" value={progress} />
        </div>

        
          <div className="p-4 rounded-md border">
            <h4 className="mb-4 text-sm font-medium leading-none">Logs</h4>
            <ScrollArea className="h-[10rem]">
              {logMessages.slice().reverse().map((message) => (
                <div key={logMessages.indexOf(message)}>
                  <div className="text-xs">
                    {message}
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </ScrollArea>
          </div>
      </SheetContent>
    </Sheet>
  )
}
2
