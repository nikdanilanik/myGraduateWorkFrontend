import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ChatRoom } from './../models/forMessage/chatRoom';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UsersUtil } from '../utils/users-util';
import { UrlPathUtil } from '../utils/url-path-util';
import { ChatMessage, ChatMessageDTO } from '../models/forMessage/chatMessage';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private chatUrl = "api/chatController/";

  constructor(private http: HttpClient,
    private matSnackBar: MatSnackBar,
    private router: Router) { }

    openOrCreateChat(chatRoom: ChatRoom): Observable<ChatRoom> {
      return this.http.post<ChatRoom>(this.chatUrl + 'chatRoom', chatRoom).pipe(
        map((data:ChatRoom) => {
          return data;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorHandling(error);
          return throwError(() => error);
        }),
        // tap(() => console.log("Запрос отправлен на сервер")), // отладочное тестирование
      )
    }

  private errorHandling(error: HttpErrorResponse) : void {
    if(error.status === 401) {
      localStorage.removeItem(UsersUtil.CURRENT_USER);
      this.router.navigateByUrl(UrlPathUtil.LOGIN);
      this.matSnackBar.open('Ошибка 401', 'Закрыть', {
        duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
    }
    if (error.status === 500) {
      localStorage.removeItem(UsersUtil.CURRENT_USER);
      this.router.navigateByUrl(UrlPathUtil.LOGIN);
      this.matSnackBar.open('Ошибка 500', 'Закрыть', {
        duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
    }
  }

  // получение списка доступных комнат
  getUserChatRooms(userId: number): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${this.chatUrl}/chatRooms?userId=${userId}`).pipe(
      map((data : ChatRoom[]) => {
        return data;
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandling(error);
        return throwError(() => error);
      }),
    );
  }
  searchMessages(
    page: number,
    size: number,
    chatRoomId: number,
    searchText?: string
  ): Observable<Page<ChatMessageDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('chatRoomId', chatRoomId.toString());

    if (searchText) {
      params = params.set('searchText', searchText);
    }

    return this.http.get<Page<ChatMessageDTO>>(this.chatUrl + "messages/search", { params }).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
