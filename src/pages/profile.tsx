import { useState, useEffect } from 'react'
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

export default function Profile() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<z.infer<typeof profileSchema> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const { session } = useAuth()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('users2').select('*').eq('auth_id', session?.user?.id).single()
      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
        form.reset(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [session?.user?.id, form])

  async function onSubmit(profile: z.infer<typeof profileSchema>) {
    setLoading(true)
    const { error } = await supabase
      .from('users2')
      .upsert({ auth_id: session?.user?.id, ...profile }, { onConflict: 'auth_id' })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    setProfile(profile)
    setIsEditing(false)
    setLoading(false)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (profile && !isEditing) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4 dark:bg-gray-900">
        <Card className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <div className="flex">
            <div className="w-1/3 bg-primary p-4 text-primary-foreground">
              <h2 className="mb-2 text-3xl font-bold">{profile.name}</h2>
              <p className="mb-4 text-lg">@{profile.username}</p>
              <p>{profile.bio}</p>
            </div>
            <div className="w-2/3 p-4 text-gray-900 dark:text-gray-100">
              <h3 className="mb-4 text-xl font-semibold">Profile Details</h3>
              <div className="space-y-2">
                <ProfileField label="Name" value={profile.name} />
                <ProfileField label="Username" value={`@${profile.username}`} />
                <ProfileField label="Bio" value={profile.bio || 'Not provided'} />
                <ProfileField label="Website" value={profile.website || 'Not provided'} />
                <ProfileField label="LinkedIn" value={profile.linkedin || 'Not provided'} />
                <ProfileField label="GitHub" value={profile.github || 'Not provided'} />
                <ProfileField label="YouTube" value={profile.youtube || 'Not provided'} />
              </div>
              <Button onClick={() => setIsEditing(true)} className="mt-4">
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Additional Content</h2>
          <Card className="p-4 shadow-lg dark:bg-gray-800">
            <p>Posts….</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{profile ? 'Edit Profile' : 'Sign Up'}</CardTitle>
          <CardDescription>Enter your information to {profile ? 'update your' : 'create an'} account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldComponent {...{ form, loading }} placeholder="John" name="name" />
                  <FormFieldComponent {...{ form, loading }} placeholder="Pinguin" name="username" />
                </div>
                <div className="grid gap-2">
                  <FormFieldComponent {...{ form, loading }} name="bio" placeholder="This is my biography" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldComponent {...{ form, loading }} name="website" placeholder="example.com" />
                  <FormFieldComponent {...{ form, loading }} name="linkedin" placeholder="linkedin.com/in/username" />
                  <FormFieldComponent {...{ form, loading }} name="github" placeholder="github.com/username" />
                  <FormFieldComponent {...{ form, loading }} name="youtube" placeholder="youtube.com/@username" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {profile ? 'Update Profile' : 'Create Profile'}
                </Button>
                {profile && (
                  <Button variant="ghost" className="mt-4 w-full" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
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

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-2">
    <strong className="text-gray-900 dark:text-gray-100">{label}:</strong>{' '}
    <span className="text-gray-900 dark:text-gray-100">{value || 'Not provided'}</span>
  </div>
)
