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
import DownloadButton from '@renderer/components/playlist/downloadButton'
import { useEffect, useState } from 'react'
import PlaylistType from '@renderer/types/PlaylistType'
import { useTokenStore } from '@renderer/stores/tokenStore'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Progress } from "@renderer/components/ui/progress"

export function DownloadMenu({ playlist }: { playlist: PlaylistType }): JSX.Element {
  const { token } = useTokenStore()
  const [open, setOpen] = useState(false)
  const [logMessages, setLogMessages] = useState<String[]>([])
  const [progress, setProgress] = useState<number>();

  async function startBackup(): Promise<void> {
    if (playlist.tracks.total < 1) {
      return
    }

    const res = await fetch(playlist.tracks.href, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch playlist contents')
    }

    const data = await res.json()
    console.log(data)
    window.api.startBackup(data)
  }

  useEffect(() => {
    const handleLog = (data: {message: string, progress?: number}): void => {
      if(open){
        console.log(data.message)
        setLogMessages(logMessages => [...new Set([...logMessages, data.message])])
        //todo: find the real cause of the duplicate logs instead of just filtering them out
        if(data.progress) {setProgress(data.progress)}
      }
    }

    window.api.onDownloadLog(handleLog)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DownloadButton onClick={() => setOpen(!open)} />
      </SheetTrigger>
      <SheetContent side="left" className="space-y-3">
        <SheetHeader className="space-y-[0rem]">
          <SheetTitle className="text-3xl">{playlist.name}</SheetTitle>
          <SheetDescription>{playlist.id}</SheetDescription>
        </SheetHeader>

        {/* this is a placeholder for now */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="">
              Folder name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
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

        <ScrollArea className="rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Logs</h4>
            {logMessages.map((message) => (
              <>
                <div key={logMessages.indexOf(message)} className="text-xs">
                  {message}
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
2
