import React from 'react'
import FriendRecommendations from '../components/FriendRecommendations/FriendRecommendations'

const FriendRecommendationsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-4 text-2xl font-bold">Friend Recommendations</h1>
      <div>
        <FriendRecommendations />
      </div>
    </div>
  )
}

export default FriendRecommendationsPage
