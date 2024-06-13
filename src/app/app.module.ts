import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found-component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './components/registration/registration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MessengerMainPageComponent } from './components/messenger-main-page/messenger-main-page.component';
import { MenuLeftUsersComponent } from './components/everything-for-users/menu-left-users/menu-left-users.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { rxStompServiceFactory } from './service/forWebSocket/rxStompServiceFactory';
import { RxStompService } from './service/forWebSocket/rx-stompService';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { SearchDialogComponent } from './components/everything-for-users/search-dialog/search-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { TimeAgoPipe } from './service/time-ago.pipe';
import { MenuLeftChatroomsComponent } from './components/everything-for-users/menu-left-chatrooms/menu-left-chatrooms.component';
import { EditUserDialogComponent } from './components/everything-for-users/edit-user-dialog/edit-user-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PageNotFoundComponent,
    AuthorizationComponent,
    RegistrationComponent,
    MessengerMainPageComponent,
    MenuLeftUsersComponent,
    ChatRoomComponent,
    SearchDialogComponent,
    TimeAgoPipe,
    MenuLeftChatroomsComponent,
    EditUserDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    BrowserModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
    // HttpClientInMemoryWebApiModule.forRoot( InMemoryDataComponent, { dataEncapsulation: false }),
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    InfiniteScrollModule,
    MatIconModule,
  ],
  providers: [{
    provide: RxStompService,
    useFactory: rxStompServiceFactory,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
