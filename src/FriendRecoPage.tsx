import React from 'react'
import useFriendRecommendation from './components/FriendRecommendations/useFriendRecommendation'

const FriendRecommendations: React.FC<{ userid: useFriendRecommendationProps }> = ({ userid }) => {
  const recommendations = useFriendRecommendation(userid)

  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-4 text-2xl font-bold">Friend Recommendations</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <useFriendRecommendation user={user} />
      </div>
    </div>
  )
}

export default FriendRecommendations
