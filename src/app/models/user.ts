export class User {
  id: number | null;
  fio: string;
  info: string;
  dateOfRegistr: Date | null;
  wasTheLastTime: Date | null;
  avatar: string;

  constructor(
    id: number | null = null,
    fio: string = "",
    info: string = "",
    dateOfRegistr: Date | null = null,
    wasTheLastTime: Date | null = null,
    avatar: string = ""
  ) {
    this.id = id;
    this.fio = fio;
    this.info = info;
    this.dateOfRegistr = dateOfRegistr;
    this.wasTheLastTime = wasTheLastTime;
    this.avatar = avatar;
  }
}
