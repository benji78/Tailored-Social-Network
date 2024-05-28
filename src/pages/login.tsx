import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { emailSchema } from '@/lib/formSchema'
import { useAuth } from '@/components/auth-context'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { logIn } = useAuth()

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '@example.com' },
  })

  async function onSubmit({ email }: z.infer<typeof emailSchema>) {
    setLoading(true)
    const error = await logIn(email, 'password')
    setLoading(false)

    if (error) {
      setError(error.message)
      console.error('Login Failed:', error)
    } else {
      // console.log(await supabase.from('users').select().eq('auth_id', data.user?.id))
      navigate('/')
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-md grow">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/*<Label htmlFor="email">Email</Label>*/}
                  {/*<Input id="email" type="email" placeholder="email@example.com" required />*/}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-muted-foreground">
                    Password
                  </Label>
                  <Input id="password" type="password" placeholder="SupaSecureP@55w0rd" disabled />
                </div>
                {error && <p>{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  Login
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
