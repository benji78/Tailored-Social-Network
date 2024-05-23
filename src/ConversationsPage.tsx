const ConversationsPage = ({ loggedInUserId, otherUserId }) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  // Fonction pour charger les conversations
  const fetchConversations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('id, content, created_at, sender_id, receiver_id')
      .or(`sender_id.eq.${loggedInUserId},receiver_id.eq.${loggedInUserId}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching data', error)
      setLoading(false)
    } else {
      setConversations(data)
      setLoading(false)
    }
  }

  // Effet pour charger les conversations lors du chargement du composant
  useEffect(() => {
    fetchConversations()
  }, [loggedInUserId, otherUserId])

  // Affichage des conversations ou du statut de chargement
  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold">Conversations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        conversations.map((conversation) => (
          <div key={conversation.id} className="mb-2 rounded border p-2 shadow-sm">
            <p>{conversation.content}</p>
            <p className="text-sm text-gray-500">Sent {new Date(conversation.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default ConversationsPage
