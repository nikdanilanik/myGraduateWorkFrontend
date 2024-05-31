import { Password } from './password';
import { UserAccess } from 'src/app/models/userAccess';
export class UserAccessAndPassword {
  userAccess: UserAccess;
  password: String;
  constructor(userAccess:UserAccess, password:String) {
    this.userAccess = userAccess;
    this.password = password;
  }
}
