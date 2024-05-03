import { Button } from "@renderer/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export default function SettingsCheckbox({ setting, defaultValue }: { setting: string, defaultValue: boolean }) {
  const [toggled, setToggled] = useState(false)

  useEffect(() => {
    window.api.getSetting(setting).then(r => console.log("HI", r))
    console.log(toggled)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => setToggled(!toggled)}>
            {toggled && 
              <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" stroke="#000" stroke-width=".005" viewBox="-333.2 -333.2 1156.4 1156.4"><path d="M452.253 28.326 197.831 394.674 29.044 256.875 0 292.469l207.253 169.205L490 54.528z"/></svg>
            }
            <span className="sr-only">Toggle save album cover</span>
          </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
