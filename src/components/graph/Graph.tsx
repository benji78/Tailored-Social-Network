import React, { useEffect, useState } from 'react'
import supabase from '../../supabase'
import ForceGraph2D from 'react-force-graph-2d'

interface User {
  user: { id: string }
}

interface Node {
  id: string
  name: string
}

interface Link {
  source: string
  target: string
}

const GraphVisualization: React.FC<User> = ({ user }) => {
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] })

  useEffect(() => {
    const fetchConnections = async () => {
      const { data: connectionsData } = await supabase.from<string, any>('connections').select('*')
      const { data: usersData } = await supabase.from<string, any>('users2').select('id, username')

      if (connectionsData && usersData) {
        const nodesMap: { [id: string]: Node } = {}
        const links: Link[] = []

        const userNames: { [id: string]: string } = {}
        usersData.forEach((user: { id: string; username: string }) => {
          userNames[user.id] = user.username
        })

        const addConnections = (userId: string, depth: number, source: string | null = null) => {
          const userConnections = connectionsData.filter((conn) => conn.user_id === userId || conn.friend_id === userId)
          userConnections.forEach(({ user_id, friend_id }) => {
            const target = user_id === userId ? friend_id : user_id
            if (!nodesMap[target]) {
              nodesMap[target] = { id: target, name: userNames[target] }
            }
            links.push({ source: source ?? userId, target }) // Le lien va de la source (userId) vers la cible (target)

            if (depth > 1) {
              addConnections(target, depth - 1, userId)
            }
          })
        }

        nodesMap[user.id] = { id: user.id, name: userNames[user.id] }
        addConnections(user.id, 2)

        setGraphData({
          nodes: Object.values(nodesMap),
          links,
        })
      }
    }

    fetchConnections()
  }, [user.id])

  return (
    <div style={{ width: '50%', height: '800px' }}>
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
