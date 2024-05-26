import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import supabase from '@/lib/supabase'
import { z } from 'zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/lib/formSchema'
import { useAuth } from '@/components/auth-context'

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { session } = useAuth()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    // defaultValues: { email: '@example.com' },
  })

  async function onSubmit(profile: z.infer<typeof profileSchema>) {
    setLoading(true)
    const { error } = await supabase.from('users').insert({ auth_id: session?.user?.id, ...profile })
    if (error) {
      alert(error.message)
      return
    }
    navigate('chat')

    setLoading(false)
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormFieldComponent {...{ form, loading }} placeholder="John" name="name" />
                  </div>
                  <div className="grid gap-2">
                    <FormFieldComponent {...{ form, loading }} placeholder="Pinguin" name="username" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormFieldComponent {...{ form, loading }} name="bio" placeholder="This is my biography" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormFieldComponent {...{ form, loading }} name="website" placeholder="example.com" />
                  </div>
                  <div className="grid gap-2">
                    <FormFieldComponent {...{ form, loading }} name="linkedin" placeholder="linkedin.com/in/username" />
                  </div>
                  <div className="grid gap-2">
                    <FormFieldComponent
                      {...{ form, loading }}
                      name="github"
                      label="GitHub"
                      placeholder="github.com/username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormFieldComponent
                      {...{ form, loading }}
                      name="youtube"
                      label="YouTube"
                      placeholder="youtube.com/@username"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Update Profile
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function capitalise(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const FormFieldComponent = ({
  form,
  loading,
  label,
  name,
  placeholder,
}: {
  form: UseFormReturn<z.infer<typeof profileSchema>>
  loading?: boolean
  label?: string
  name: keyof z.infer<typeof profileSchema>
  placeholder: string
}) => {
  if (!label) label = capitalise(name)
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} disabled={loading} {...{ placeholder }} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
