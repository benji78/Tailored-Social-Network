import { useEffect, useState } from 'react'
import supabase from '../../supabase'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
interface useFriendRecommendationProps {
  user: User
}
interface UserData {
  connections: string[]
  interests: string[]
}

interface Recommendation {
  userId: string
  username: string
  score: number
}

const FriendRecommendations: React.FC<useFriendRecommendationProps> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

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

      const connections = connectionsData ? connectionsData.map((conn) => conn.friend_id) : []
      const interests = interestsData ? interestsData.map((interest) => interest.interest_id) : []

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
      const { connections: userConnections, interests: userInterests } = await fetchUserData(user.id)
      console.log({ connections: userConnections, interests: userInterests })
      const currentUser = user.id
      const { data: allUsers } = await supabase.from<string, any>('users2').select('*')
      console.log(allUsers)
      if (!allUsers) return

      const recommendations: Recommendation[] = []

      for (const user of allUsers) {
        if (currentUser !== user.id && !userConnections.includes(user.id)) {
          console.log('test')
          const { connections: otherConnections, interests: otherInterests } = await fetchUserData(user.id)
          const score = calculateRecommendationScore(userConnections, userInterests, otherConnections, otherInterests)
          console.log({ userId: user.id, score })
          recommendations.push({ userId: user.id, username: user.name, score })
        }
      }

      recommendations.sort((a, b) => b.score - a.score)
      setRecommendations(recommendations.slice(0, 10))
    }

    generateFriendRecommendations()
  }, [user.id])

  console.log('recommendations', recommendations)

  const handleConnect = async (friendId: string) => {
    const { error } = await supabase.from('connections').insert([{ user_id: user.id, friend_id: friendId }])

    if (error) {
      console.error('Error connecting to user:', error)
    } else {
      console.log('Successfully connected to user:', friendId)
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
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
