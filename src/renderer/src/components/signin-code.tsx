import { Button } from "@renderer/components/ui/button"
import { Input } from "@renderer/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog"
import { useState } from "react"

export default function SignInCode({ isOpen, onOpenChange, signInCode, handleGetCode }) {
  const [code, setCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild className="scale-75 ml-[-1.5rem]">
        <Button variant="outline">use signin codes instead</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In with Code</DialogTitle>
          <DialogDescription>
            Obtain a code on one device, sign in on another.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-medium">Get a Code</h3>
            <p className="text-sm text-muted-foreground">
              Click the button below to get a sign-in code.
            </p>
            <Button className="mt-2" onClick={handleGetCode}>
              Get Code
            </Button>
            {generatedCode && (
              <p className="mt-2 text-sm font-medium">{generatedCode}</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">Use a Code</h3>
            <p className="text-sm text-muted-foreground">
              Enter the code obtained on another device.
            </p>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-2"
            />
            <Button className="mt-2" type="submit">
              Sign In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
