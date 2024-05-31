import { User } from "../user";

export class ChatRoom {
  constructor(id: number | null = null, name: string = "", users: User[] = []) {
    this.id = null;
    this.name = "";
    this.users = [];
  }
  id: number | null;
  name: string;
  users: User[];
}
