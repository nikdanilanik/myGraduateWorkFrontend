import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { map, timeout, toArray } from 'rxjs';
import { ChatMessage } from 'src/app/models/forMessage/chatMessage';
import { ChatMessageStatus } from 'src/app/models/forMessage/chatMessageStatus';
import { ChatRoom } from 'src/app/models/forMessage/chatRoom';
import { Page } from 'src/app/models/page';
import { User } from 'src/app/models/user';
import { RxStompService } from 'src/app/service/forWebSocket/rx-stompService';
import { MessageService } from 'src/app/service/message.service';
import { UsersUtil } from 'src/app/utils/users-util';
import { SearchDialogComponent } from '../everything-for-users/search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatMessageDTO } from 'src/app/models/dtoFiles/ChatMessageDTO';
import { BaseServiceService } from 'src/app/service/base-service.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css', '../messenger-main-page/messenger-main-page.component.css']
})
export class ChatRoomComponent implements AfterViewChecked, AfterViewInit {
  selectedFile: File | null = null;
  currentSelectedUser = new User();
  currentUserString = localStorage.getItem(UsersUtil.CURRENT_USER);
  currentUser : User = this.currentUserString ? JSON.parse(this.currentUserString):0;

  isLoading: boolean = false;
  totalElements: number = 0;
  pageSize: number = 30;
  currentPage: number = 1;
  totalPages: number = 0;
  first: boolean = false;
  last: boolean = false;
  searhText: string = "";
  sortData: string = "id,desc";

  @Input()
  set selectedUser(value: User) {
    this.currentSelectedUser = value;
    this.openOrCreate();
  }
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: ChatMessage = new ChatMessage();
  currentChatRoom: ChatRoom = new ChatRoom();

  constructor(private messageService: MessageService,
    private rxStompService: RxStompService,
    private matDialog: MatDialog,
    private baseService: BaseServiceService,
  ) {}

  // Выгрузка всех сообщений
  loadMessages(): void {
    if (this.currentUser && this.currentChatRoom) {
      this.getTotalPagesAndLoadMessages();
    } else {
      console.error('User or Chat Room is not set');
    }
  }

  // получение инфы о сообщениях (кол-во)
  getTotalPagesAndLoadMessages(): void {
    this.sortData = "id,desc";

    this.messageService.searchMessages(
      this.currentPage,
      this.pageSize,
      this.sortData,
      this.currentChatRoom.id!,
      this.searhText
    ).subscribe({

      next: (page: Page<ChatMessageDTO>) => {
        this.totalElements = page.totalElements;

        this.currentPage = this.totalPages;

        this.loadLastMessages();
      },
      error: (err: any) => console.error(err)
    });
  }

  // сама выгрузка сообщений
  loadLastMessages(): void {
    this.messageService.searchMessages(
      this.currentPage,
      this.pageSize,
      this.sortData,
      this.currentChatRoom.id!,
      this.searhText
    ).subscribe({
      next: (finalPage: Page<ChatMessageDTO>) => {
        this.messages = finalPage.content
          .map(ChatMessage.mapChatMessageDTOToChatMessage)
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

        this.totalElements = finalPage.totalElements;
        this.totalPages = finalPage.totalPages;
        this.first = finalPage.first;
        this.last = finalPage.last;
      },
      error: (err: any) => console.error(err)
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMessages();
    }
  }

  ngAfterViewInit(): void {
    if (this.currentUser.id) {
      this.messageService.getUserChatRooms(this.currentUser.id).subscribe((chatRooms: ChatRoom[]) => {
        const roomIds = chatRooms.map(chatRoom => chatRoom.id);

        // Подписка на все каналы
        roomIds.forEach(roomId => {
          this.rxStompService.watch(`/user/${roomId}/public`).subscribe(message => {
            this.messages.push(JSON.parse(message.body))
          }, error => {
            console.error('Ошибка при подписке на канал:', error);
          });
        });
      }, error => {
        console.error('Ошибка при получении комнат пользователя:', error);
      });
    }
  }

  // Отвечает за создание или открытие чата
  openOrCreate() {
    if (this.currentSelectedUser.id == this.currentUser.id) {this.currentSelectedUser.id = null;}
    if (!this.currentSelectedUser.id) {
      this.currentSelectedUser = this.currentUser;
      let chatRoom: ChatRoom = new ChatRoom();
      if (this.currentUser.id) chatRoom.name = this.currentUser.id.toString();
      chatRoom.users = [this.currentUser];
      this.messageService.openOrCreateChat(chatRoom).subscribe(res => {
        this.currentChatRoom = res;
        this.loadMessages();
      });
    }
    else {
      let chatRoom: ChatRoom = new ChatRoom();
      if (this.currentUser.id) chatRoom.name = this.currentUser.id.toString() + "_" + this.currentSelectedUser.id.toString();
      let users: User[] = [];
      users.push(this.currentUser);
      users.push(this.currentSelectedUser);
      chatRoom.users = users;
      this.messageService.openOrCreateChat(chatRoom).subscribe(res => {
        this.currentChatRoom = res;
        this.loadMessages();
      });
    }
  }

  // Вызов окна для поиска по сообщениям
  openSearchDialog(): void {
    const dialogRef = this.matDialog.open(SearchDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searhText = result;
        this.loadMessages();
      }
    });
  }

  // async delay(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
  // async example() {
  //   await this.delay(5000);
  //   console.log(this.selectedUser)
  // }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error(err);
    }
  }

  // Отправка сообщений
  sendMessage(): void {
    if (this.newMessage.content.trim() != '') {
      this.newMessage.user = this.currentUser;
      this.newMessage.status = ChatMessageStatus.SENT;
      this.newMessage.chatRoom = this.currentChatRoom;
      this.rxStompService.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(this.newMessage) });
      this.newMessage = new ChatMessage;
      this.scrollToBottom();
    }
  }

  // прикрепление файла
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);
    }
  }
  attach() {
    if (this.selectedFile) {
      // Логика отправки файла на сервер
      this.baseService.uploadFile(this.selectedFile);
    }
  }

  // Метод для времени и даты к сообщениям
  formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const messageDate = new Date(date);
    const today = new Date();

    const isToday = messageDate.getDate() === today.getDate() &&
                    messageDate.getMonth() === today.getMonth() &&
                    messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return `${messageDate.getHours()}:${('0' + messageDate.getMinutes()).slice(-2)}`;
    } else {
      return messageDate.toLocaleString();
    }
  }
}
