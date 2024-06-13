export class UserDTO {
  id: number;
  fio: string;
  info: string;
  dateOfRegistr: Date;
  wasTheLastTime: Date;
  avatar: string;

  constructor(id: number, fio: string, info: string, dateOfRegistr: Date, wasTheLastTime: Date, avatar: string) {
      this.id = id;
      this.fio = fio;
      this.info = info;
      this.dateOfRegistr = dateOfRegistr;
      this.wasTheLastTime = wasTheLastTime;
      this.avatar = avatar;
  }
}
