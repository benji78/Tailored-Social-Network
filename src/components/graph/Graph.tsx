import React, { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import ForceGraph2D from 'react-force-graph-2d'

interface Node {
  id: string
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
            nodesMap[user.auth_id] = { id: user.auth_id, name: user.username }
          }
        })

        connectionsData.forEach(({ user_id, friend_id }) => {
          if (user_id && friend_id) {
            links.push({ source: user_id, target: friend_id })
          }
        })
        console.log(links)
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
        nodeCanvasObject={(node, ctx, globalScale) => {
          const nodeSize = 5 // Size of the node
          ctx.beginPath()
          ctx.arc(node.x ? node.x : 0, node.y ? node.y : 0, nodeSize, 0, 2 * Math.PI, false)
          ctx.fillStyle = node.color // Set the color of the node to the random color
          ctx.fill()

          const label = node.name
          const fontSize = 12 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = 'black' // Set the color of the text
          ctx.fillText(label, node.x ? node.x : 0, node.y ? node.y : 0)
        }}
      />
    </div>
  )
}

export default GraphVisualization
