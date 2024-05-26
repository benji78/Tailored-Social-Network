import React, { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import ForceGraph2D from 'react-force-graph-2d'

interface Node {
  auth_id: string
  name: string
}

interface Link {
  source: string
  target: string
}

const GraphVisualization: React.FC = () => {
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] })

  useEffect(() => {
    const fetchConnections = async () => {
      const { data: connectionsData } = await supabase.from<string, any>('connections').select('*')
      const { data: usersData } = await supabase.from<string, any>('users2').select('auth_id, username')

      if (connectionsData && usersData) {
        const nodesMap: { [id: string]: Node } = {}
        const links: Link[] = []

        usersData.forEach((user: { auth_id: string; username: string }) => {
          if (user.auth_id) {
            nodesMap[user.auth_id] = { auth_id: user.auth_id, name: user.username }
          }
        })

        connectionsData.forEach(({ user_id, friend_id }) => {
          if (user_id && friend_id) {
            links.push({ source: user_id, target: friend_id })
          }
        })

        setGraphData({
          nodes: Object.values(nodesMap),
          links,
        })
      }
    }

    fetchConnections()
  }, [])

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="id"
        linkDirectionalArrowLength={6} // Longueur des flèches de lien
        linkDirectionalArrowRelPos={1} // Position relative des flèches de lien
      />
    </div>
  )
}

export default GraphVisualization
