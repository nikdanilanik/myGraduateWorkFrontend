import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Authen } from 'src/app/models/authen';
import { User } from 'src/app/models/user';
import { UserAccess } from 'src/app/models/userAccess';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { UrlPathUtil } from 'src/app/utils/url-path-util';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user: User;
  password: String;
  userLoginAndPass: UserAccess;

  constructor(private router: Router,
    private authService: AuthServiceService,
    private authGuardService: AuthGuardService,
    private matSnackBar: MatSnackBar) {
      this.user = new User();
      this.password = new String();
      this.userLoginAndPass = new UserAccess();
      this.authGuardService.isAuthenticatedAndNavigate();
  }

  homeClick() {
    this.router.navigateByUrl(UrlPathUtil.HOME);
  }

  registr() {
    if ( this.user.fio == "" || this.userLoginAndPass.login == "" || this.userLoginAndPass.password == "") {
      this.matSnackBar.open('Заполните все поля', 'Закрыть', {
        duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
    }
    // Нужно добавить проверку на наличия пользователей с таким login
    else if (this.password !== this.userLoginAndPass.password) {
      this.matSnackBar.open('Пароли не совпадают', 'Закрыть', {
      duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
    }
    else {
      this.userLoginAndPass.userId;
      this.authService.registrSetDetails(this.user, this.userLoginAndPass);
    }
  }
}
