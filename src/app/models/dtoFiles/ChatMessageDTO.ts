import { ChatMessageStatus } from "../forMessage/chatMessageStatus";

export class ChatMessageDTO {
  id: number;
  content: string;
  dateOfCreate: Date;
  status: ChatMessageStatus;
  userId: number | null;
  chatRoomId: number | null;

  constructor(id: number, content: string, dateOfCreate: Date, status: ChatMessageStatus, userId: number | null, chatRoomId: number | null) {
      this.id = id;
      this.content = content;
      this.dateOfCreate = dateOfCreate;
      this.status = status;
      this.userId = userId;
      this.chatRoomId = chatRoomId;
  }
}
