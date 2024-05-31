import { Password } from "./password";
import { RoleEnum } from "./roleEnum";

export class UserAccess {
  constructor(id?: number, login?: string, role?: RoleEnum, userId?: number, password?: string, enabled?: boolean) {
    if (id != undefined) this.id = id;
    else this.id = null;
    if (login != undefined) this.login = login;
    else this.login = "";
    if (role != undefined) this.role = role;
    else this.role = RoleEnum.USER;
    if (userId != undefined) this.userId = userId;
    else this.userId = null;
    if (password != undefined) this.password = password;
    else this.password = "";
    if (enabled != undefined) this.enabled = enabled;
    else this.enabled = false;
  }

  id: number | null;
  login: string;
  role: RoleEnum;
  userId: number | null;
  password: string;
  enabled: boolean;
}
