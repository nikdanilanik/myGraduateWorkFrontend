import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatRoomDTO } from 'src/app/models/dtoFiles/chatRoomDTO';
import { ChatRoom } from 'src/app/models/forMessage/chatRoom';
import { User } from 'src/app/models/user';
import { UsersUtil } from 'src/app/utils/users-util';

@Component({
  selector: 'app-menu-left-chatrooms',
  templateUrl: './menu-left-chatrooms.component.html',
  styleUrls: ['./menu-left-chatrooms.component.css']
})
export class MenuLeftChatroomsComponent {
  @Input() chatRoomDTOs!: ChatRoomDTO[];
  @Output() chatRoomDTOSelected: EventEmitter<ChatRoomDTO> = new EventEmitter<ChatRoomDTO>();

  constructor() {}

  onSelectChatRoom(chatRoomDTO: ChatRoomDTO) {
    this.chatRoomDTOSelected.emit(chatRoomDTO);
  }

  getUserIndex(chatRoomDTO: ChatRoomDTO): number {
    const userId = Number(localStorage.getItem(UsersUtil.USER_ID));
    for (let i = 0; i < chatRoomDTO.users.length; i++) {
      if (chatRoomDTO.users.length == 1) {
        return i;
      }
      if (chatRoomDTO.users[i].id !== userId) {
        return i;
      }
    }
    return -1;
}

  getAvatar(chatRoomDTO: ChatRoomDTO): string {
    // Возвращаем URL аватарки первого пользователя в чате (или любой другой логики)
    return chatRoomDTO.users[this.getUserIndex(chatRoomDTO)]?.avatar || 'default-avatar-url';
  }

  getUserFullName(chatRoomDTO: ChatRoomDTO): string {
    // Возвращаем полное имя первого пользователя в чате (или любой другой логики)
    return chatRoomDTO.users[this.getUserIndex(chatRoomDTO)]?.fio || 'Unknown User';
  }

  getLastSeen(chatRoomDTO: ChatRoomDTO): Date {
    // Возвращаем дату последнего посещения первого пользователя в чате (или любой другой логики)
    return chatRoomDTO.users[this.getUserIndex(chatRoomDTO)]?.wasTheLastTime || new Date();
  }
}
