import { Card } from '@/components/ui/card'
import { Message } from '@/types/Types'

const ChatMessage = ({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) => {
  return (
    <Card
      className={`my-2 p-2 ${isCurrentUser ? 'ms-5 bg-gray-900 text-right text-white' : 'me-5 bg-gray-300 text-left text-black'}`}
    >
      {message.content}
    </Card>
  )
}

export default ChatMessage
