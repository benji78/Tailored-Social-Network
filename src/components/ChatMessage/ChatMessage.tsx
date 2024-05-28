import { Card } from '../ui/card'
import { Message } from '@/types/Types'

const ChatMessage = ({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) => {
  return (
    <Card
      className={`my-2 p-2 ${isCurrentUser ? 'bg-gray-900 text-right text-white' : 'bg-gray-300 text-left text-black'}`}
    >
      {message.content}
    </Card>
  )
}

export default ChatMessage
