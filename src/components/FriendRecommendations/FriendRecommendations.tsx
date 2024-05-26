import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useAuth } from '../auth-context'

interface UserData {
  connections: string[]
  interests: string[]
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
      const { data: connectionsData } = await supabase
        .from<string, any>('connections')
        .select('friend_id')
        .eq('user_id', userId)

      const { data: interestsData } = await supabase
        .from<string, any>('is_interested_in')
        .select('interest_id')
        .eq('user_id', userId)

      const connections = connectionsData ? connectionsData.map((conn: { friend_id: any }) => conn.friend_id) : []
      const interests = interestsData ? interestsData.map((interest: { interest_id: any }) => interest.interest_id) : []

      return { connections, interests }
    }

    const calculateCommonConnections = (userConnections: string[], otherConnections: string[]): number => {
      return userConnections.filter((conn) => otherConnections.includes(conn)).length
    }

    const calculateCommonInterests = (userInterests: string[], otherInterests: string[]): number => {
      return userInterests.filter((interest) => otherInterests.includes(interest)).length
    }

    const calculateRecommendationScore = (
      userConnections: string[],
      userInterests: string[],
      otherConnections: string[],
      otherInterests: string[]
    ): number => {
      const commonConnections = calculateCommonConnections(userConnections, otherConnections)
      const commonInterests = calculateCommonInterests(userInterests, otherInterests)
      const connectionWeight = 0.7
      const interestWeight = 0.3
      return connectionWeight * commonConnections + interestWeight * commonInterests
    }

    const generateFriendRecommendations = async () => {
      const currentUser = session?.user?.id
      if (currentUser) {
        const { connections: userConnections, interests: userInterests } = await fetchUserData(currentUser)
        console.log({ connections: userConnections, interests: userInterests })
        const { data: allUsers } = await supabase.from<string, any>('users2').select('*')
        console.log(allUsers)
        if (!allUsers) return

        const recommendations: Recommendation[] = []

        for (const user of allUsers) {
          if (currentUser !== user.auth_id && !userConnections.includes(user.auth_id) && user.auth_id) {
            const { connections: otherConnections, interests: otherInterests } = await fetchUserData(user.auth_id)
            const score = calculateRecommendationScore(userConnections, userInterests, otherConnections, otherInterests)
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
          // Supprimer la recommandation de la liste
          const updatedRecommendations = [...recommendations]
          updatedRecommendations.splice(index, 1)
          setRecommendations(recommendations.filter((recommendation) => recommendation.userId !== friendId))
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
