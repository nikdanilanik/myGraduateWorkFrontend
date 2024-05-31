import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-menu-left-users',
  templateUrl: './menu-left-users.component.html',
  styleUrls: ['./menu-left-users.component.css',]
})
export class MenuLeftUsersComponent {

  @Input() users!: User[];
  @Output() userSelected: EventEmitter<User> = new EventEmitter<User>();

  constructor() {}

  onSelectUser(user: User) {
    this.userSelected.emit(user);
  }
}
