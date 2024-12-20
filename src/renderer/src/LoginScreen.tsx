import { useEffect } from 'react'
import { Input } from './components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { generateCodeVerifier, generateCodeChallenge } from './pkce'
import Settings from './components/settings/settings'

const formSchema = z.object({
  client_id: z.string().min(32, {
    message: "client id must at least 32 characters!",
  }),
})

function LoginScreen() {
  useEffect(() => {
    const getClientId = async () => {
      const storedClientId = await window.api.getSetting('client_id')
      if (storedClientId) {
        form.setValue('client_id', storedClientId);
      }
    };
    getClientId();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    
    await window.api.setSetting({ setting: 'client_id', value: values.client_id })
    await window.api.setSetting({ setting: 'code_verifier', value: codeVerifier })
    await window.api.setSetting({ setting: 'code_challenge', value: codeChallenge })

    window.api.startAuthFlow()
  }

  useEffect(() => {
    const handleToken = async (token: string) => {
      await window.api.setSetting({ setting: 'token', value: token })
      window.location.reload()
    };

    window.api.onSetToken(handleToken)
  }, [])

  return (
    <div className="my-[25vh]">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify API Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="client_id" spellCheck="false" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be saved
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Open Browser to Login</Button>
            
          </form>
        </Form>
      </CardContent>
      <div className="fixed top-2 right-2 flex space-x-2">
        <Settings />
      </div>
    </div>
  )
}

export default LoginScreen;