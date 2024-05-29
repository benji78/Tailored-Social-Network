import React, { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d'

interface Node {
  id: string
  name: string
  type: 'user' | 'tag'
}

interface Link {
  source: string
  target: string
}

const GraphVisualization: React.FC = () => {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth)
  const [displayHeight, setDisplayHeight] = useState(window.innerHeight)
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] })

  const fetchConnections = async () => {
    const { data: connectionsData } = await supabase.from('connections').select('*')
    const { data: usersData } = await supabase.from('users2').select('auth_id, username')
    const { data: tagsData } = await supabase.from('tags').select('*')
    const { data: tagsLinksData } = await supabase.from('have_tags').select('*')
    const { data: projectsData } = await supabase.from('projects').select('*')

    if (connectionsData && usersData && tagsLinksData && tagsData && projectsData) {
      const nodes: Node[] = []
      const links: Link[] = []

      usersData.forEach((user) => {
        if (user.auth_id) {
          nodes.push({ id: user.auth_id, name: user.username, type: 'user' })
        }
      })

      // Création des nœuds pour les tags
      tagsData.forEach((tag) => {
        nodes.push({ id: tag.id.toString(), name: tag.name, type: 'tag' })
      })

      projectsData.forEach((project) => {
        const userNode = nodes.find((node) => node.id === project.user_id)

        if (userNode) {
          // Création des liens entre le projet et ses tags
          const projectTags = tagsLinksData.filter((tagLink) => tagLink.project_id === project.id)
          projectTags.forEach((tagLink) => {
            const tagNode = nodes.find((node) => node.id === tagLink.tags_id.toString())
            if (tagNode) {
              links.push({ source: userNode.id.toString(), target: tagNode.id })
            }
          })
        }
      })

      // Construct links between users (if needed)
      connectionsData?.forEach(({ user_id, friend_id }) => {
        if (user_id && friend_id) {
          links.push({ source: user_id, target: friend_id })
        }
      })

      setGraphData({ nodes, links })
    }
  }
  const graphRef = React.useRef<ForceGraphMethods>()
  graphRef?.current?.d3Force('charge')?.strength(-200)
  // graphRef?.current?.d3Force('link')?.strength(0.1)

  useEffect(() => {
    void fetchConnections()
  }, [])

  window.addEventListener('resize', () => {
    setDisplayWidth(window.innerWidth)
    setDisplayHeight(window.innerHeight)
  })

  return (
    <div className="flex max-h-screen w-full flex-col">
      <ForceGraph2D
        ref={graphRef}
        width={displayWidth}
        height={displayHeight - 60}
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="type"
        linkDirectionalArrowLength={12}
        linkDirectionalArrowRelPos={0.9}
        linkCurvature={0.2} // Curve links a bit for better visibility
        nodeCanvasObject={(node, ctx, globalScale) => {
          const nodeSize = node.type === 'user' ? 10 : 8 // Adjust node size for user and tag nodes
          ctx.beginPath()
          ctx.arc(node.x ?? 0, node.y ?? 0, nodeSize, 0, 2 * Math.PI, false)
          ctx.fillStyle = node.color
          ctx.fill()

          const label = node.name
          const fontSize = 12 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = 'black'
          ctx.fillText(label, node.x ?? 0, node.y ?? 0)
        }}
      />
    </div>
  )
}

export default GraphVisualization
