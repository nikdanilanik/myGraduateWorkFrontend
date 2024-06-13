import { ChatMessage } from 'src/app/models/forMessage/chatMessage';
import { ChatRoom } from 'src/app/models/forMessage/chatRoom';
import { UserDTO } from './userDTO';
import { ChatMessageDTO } from './ChatMessageDTO';

export class ChatRoomDTO {
  id: number | null;
  name: string;
  users: UserDTO[];
  lastMessage: ChatMessageDTO | null;

  constructor() {
      this.id = null;
      this.name = "";
      this.users = [];
      this.lastMessage = null;
  }
}
