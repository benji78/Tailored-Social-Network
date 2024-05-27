import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useAuth } from '../auth-context'

interface UserData {
  connections: string[]
  projectTags: string[]
  connectedUsersTags: string[]
}

interface Recommendation {
  userId: string
  username: string
  score: number
}

const FriendRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const { session } = useAuth()
  const user = session?.user

  useEffect(() => {
    const fetchUserData = async (userId: string): Promise<UserData> => {
      const { data: connectionsData } = await supabase.from('connections').select('friend_id').eq('user_id', userId)

      const { data: projectData } = await supabase.from('projects').select('id').eq('user_id', userId)

      const projectIds = projectData ? projectData.map((project: { id: any }) => project.id) : []

      const { data: tagsData } = await supabase.from('have_tags').select('tags_id').in('project_id', projectIds)

      const connections = connectionsData ? connectionsData.map((conn: { friend_id: any }) => conn.friend_id) : []
      const projectTags = tagsData ? tagsData.map((tag: { tags_id: any }) => tag.tags_id) : []

      // Fetch tags of connected users
      const connectedUsersTags: string[] = []
      for (const connectionId of connections) {
        const { data: connectedProjectData } = await supabase.from('projects').select('id').eq('user_id', connectionId)
        const connectedProjectIds = connectedProjectData
          ? connectedProjectData.map((project: { id: any }) => project.id)
          : []
        const { data: connectedTagsData } = await supabase
          .from('have_tags')
          .select('tags_id')
          .in('project_id', connectedProjectIds)
        const connectedTags = connectedTagsData ? connectedTagsData.map((tag: { tags_id: any }) => tag.tags_id) : []
        connectedUsersTags.push(...connectedTags)
      }

      return { connections, projectTags, connectedUsersTags }
    }

    const calculateCommonConnections = (userConnections: string[], otherConnections: string[]): number => {
      return userConnections.filter((conn) => otherConnections.includes(conn)).length // Return number of connection in common
    }

    const calculateCommonProjectTags = (userTags: string[], otherTags: string[]): number => {
      return userTags.filter((tag) => otherTags.includes(tag)).length // Return number of tags in common
    }

    const calculateRecommendationScore = (
      userConnections: string[],
      userProjectTags: string[],
      userConnectedTags: string[],
      otherConnections: string[],
      otherProjectTags: string[],
      otherConnectedTags: string[]
    ): number => {
      const commonConnections = calculateCommonConnections(userConnections, otherConnections)
      const commonProjectTags = calculateCommonProjectTags(userProjectTags, otherProjectTags) // Return number of tags in common
      const commonConnectedTags = calculateCommonProjectTags(userConnectedTags, otherConnectedTags) // Return number of direct friends tags in common with users

      const connectionWeight = 0.5
      const tagWeight = 0.3
      const connectedTagWeight = 0.2

      console.log({
        connectionWeight,
        commonConnections,
        tagWeight,
        commonProjectTags,
        connectedTagWeight,
        commonConnectedTags,
      })

      return (
        connectionWeight * commonConnections + tagWeight * commonProjectTags + connectedTagWeight * commonConnectedTags
      )
    }

    const generateFriendRecommendations = async () => {
      const currentUser = session?.user?.id
      if (currentUser) {
        const {
          connections: userConnections,
          projectTags: userProjectTags,
          connectedUsersTags: userConnectedTags,
        } = await fetchUserData(currentUser)
        console.log({
          connections: userConnections,
          projectTags: userProjectTags,
          connectedUsersTags: userConnectedTags,
        })
        const { data: allUsers } = await supabase.from('users2').select('*')
        console.log(allUsers)
        if (!allUsers) return

        const recommendations: Recommendation[] = []

        for (const user of allUsers) {
          if (currentUser !== user.auth_id && !userConnections.includes(user.auth_id) && user.auth_id) {
            const {
              connections: otherConnections,
              projectTags: otherProjectTags,
              connectedUsersTags: otherConnectedTags,
            } = await fetchUserData(user.auth_id)
            const score = calculateRecommendationScore(
              userConnections,
              userProjectTags,
              userConnectedTags,
              otherConnections,
              otherProjectTags,
              otherConnectedTags
            )
            recommendations.push({ userId: user.auth_id, username: user.username, score })
          }
        }

        recommendations.sort((a, b) => b.score - a.score)
        setRecommendations(recommendations.slice(0, 10))
      }
    }

    generateFriendRecommendations()
  }, [session?.user?.id])

  const handleConnect = async (friendId: string) => {
    if (user) {
      const { error } = await supabase.from('connections').insert([{ user_id: user.id, friend_id: friendId }])

      if (error) {
        console.error('Error connecting to user:', error)
      } else {
        console.log('Successfully connected to user:', friendId)
        const index = recommendations.findIndex((recommendation) => recommendation.userId === friendId)
        if (index !== -1) {
          // Remove the recommendation from the list
          const updatedRecommendations = [...recommendations]
          updatedRecommendations.splice(index, 1)
          setRecommendations(updatedRecommendations)
        }
      }
    }
  }

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {recommendations.map((recommendation, index) => (
          <CarouselItem key={index} className={`${recommendations.length > 3 ? 'md:basis-1/2 lg:basis-1/3' : ''}`}>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{recommendation.username}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Score: {recommendation.score}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => handleConnect(recommendation.userId)}>Se connecter</Button>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default FriendRecommendations
