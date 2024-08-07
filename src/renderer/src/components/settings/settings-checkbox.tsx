import { Button } from "@renderer/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export default function SettingsCheckbox({ setting, onClick }: { setting: string, onClick?: Function | undefined }) {
  const [toggled, setToggled] = useState(false)

  useEffect(() => {
    window.api.getSetting(setting).then(value => setToggled(value))
  }, [])

  async function onRealClick() {
    try {
      await window.api.setSetting({setting: setting, value: !toggled})
      setToggled(!toggled)
      if(onClick) onClick()
    } catch (error) {
      console.error(`Failed to set ${setting}:`, error)
    }
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" onClick={onRealClick}>
            {toggled && 
              <svg className="dark:fill-slate-200" xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="-333.2 -333.2 1156.4 1156.4"><path d="M452.253 28.326 197.831 394.674 29.044 256.875 0 292.469l207.253 169.205L490 54.528z"/></svg>
            }
            <span className="sr-only">Toggle save album cover</span>
          </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
