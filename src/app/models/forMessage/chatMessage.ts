import { User } from './../user';
import { ChatMessageStatus } from './chatMessageStatus';
import { ChatRoom } from './chatRoom';
export class ChatMessage {
  id: number | null;
  user: User;
  content: string;
  chatRoom: ChatRoom;
  dateOfCreate: Date | null;
  status: ChatMessageStatus | null;

  constructor() {
    this.id = null;
    this.user = new User();
    this.content = "";
    this.chatRoom = new ChatRoom();
    this.dateOfCreate = null;
    this.status = null;
  }

  static mapChatMessageDTOToChatMessage(dto: ChatMessageDTO): ChatMessage {
    const chatMessage = new ChatMessage();
    chatMessage.id = dto.id;
    chatMessage.content = dto.content;
    chatMessage.dateOfCreate = dto.dateOfCreate;
    chatMessage.status = dto.status;
    chatMessage.user = new User(dto.userId);
    chatMessage.chatRoom = new ChatRoom(dto.chatRoomId);
    return chatMessage;
  }
}

export interface ChatMessageDTO {
  id: number;
  content: string;
  dateOfCreate: Date;
  status: ChatMessageStatus;
  userId: number;
  chatRoomId: number;
}
