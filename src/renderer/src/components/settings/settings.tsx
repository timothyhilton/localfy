import { Button } from "@renderer/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import { ModeToggle } from "../mode-toggle"
import { useEffect, useState } from "react"
import SettingsCheckbox from "./settings-checkbox"

export default function Settings(){
  const [directory, setDirectory] = useState<string>()

  useEffect(() => {
    window.api.getDirectory()
      .then(setDirectory)
  }, []);

  function changeDirectory(){
    window.api.changeDirectory()
      .then((directory) => {
        if(directory){ setDirectory(directory) }
      })
  }

  return(
    <Dialog>
      <DialogTrigger asChild className="fixed right-2 top-2">
        <Button variant="outline" size="icon">
          Settings
          <span className="sr-only">Toggle settings window</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Save Album Cover
            </Label>
            <SettingsCheckbox setting="saveCoverArt"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Theme
            </Label>
            <ModeToggle />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="directory" className="text-right">
              Directory
            </Label>
            <Input
              value={directory}
              readOnly
              className="col-span-3 hover:cursor-pointer"
              onClick={changeDirectory}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}