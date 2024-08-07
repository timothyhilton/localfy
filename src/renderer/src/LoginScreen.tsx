// LoginScreen.tsx
import { useEffect, useState } from 'react';
import { useTokenStore } from '@renderer/stores/tokenStore';
import HomePage from '@renderer/HomePage';
import { Input } from './components/ui/input';
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
import { CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { ModeToggle } from './components/mode-toggle';

const formSchema = z.object({
  client_id: z.string().min(32, {
    message: "client id must at least 32 characters!",
  }),
})

function LoginScreen() {
  const { token } = useTokenStore();
  const [client_id, setClientId] = useState<string>("");

  if(localStorage.getItem('client_id') == null){
    localStorage.setItem('client_id', "");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: localStorage.getItem('client_id')!,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setClientId(values.client_id);
    window.api.startAuthFlow(values.client_id);
  }

  useEffect(() => {
    const handleToken = (token: string) => {
      localStorage.setItem('client_id', client_id);
      useTokenStore.getState().setToken(token);
    };

    window.api.onSetToken(handleToken);

  }, [client_id]);

  if (token && token != "") {
    return <HomePage />;
  } else {
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
                    <FormLabel>Spotify API Client id</FormLabel>
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
        <div className="fixed top-2 right-2">
          <ModeToggle />
        </div>
      </div>
    );
  }
}

export default LoginScreen;