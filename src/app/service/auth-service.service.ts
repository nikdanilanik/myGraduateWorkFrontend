import { AuthGuardService } from './auth-guard.service';
import { UrlPathUtil } from 'src/app/utils/url-path-util';
import { Router } from '@angular/router';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { User } from './../models/user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersUtil } from '../utils/users-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseServiceService } from './base-service.service';
import { UserAccess } from '../models/userAccess';
import { UserAccessAndPassword } from '../models/userAccessAndPassword';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private usersUrl = '/api/authAndRegistr';

  constructor(private http: HttpClient,
    private router: Router,
    private authGuardService: AuthGuardService,
    private matSnackBar: MatSnackBar,
    private baseService: BaseServiceService) { }

  auth(loginAndPass: String) {
    this.login(loginAndPass).subscribe(data => {
      this.baseService.getOnlyOneUser(Number(localStorage.getItem(UsersUtil.USER_ID))).subscribe(dataInfo => {
        localStorage.setItem(UsersUtil.CURRENT_FIO, dataInfo.fio);
        localStorage.setItem(UsersUtil.CURRENT_AVATAR, dataInfo.avatar);
        this.authGuardService.isAuthenticatedAndNavigate();
      });
    });
  }

  login(loginAndPass: String): Observable<unknown> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + loginAndPass,
      })
    };

    return this.http.post<any>(this.usersUrl + '/login', null, httpOptions).pipe(
      map(data => {
        let user: User = new User();

        localStorage.setItem(UsersUtil.LOGIN, data.principal.username);
        localStorage.setItem(UsersUtil.ENABLED, data.principal.enabled);
        localStorage.setItem(UsersUtil.ROLE, data.principal.authorities[0].authority);
        localStorage.setItem(UsersUtil.USER_ID, data.details.user_id);

        this.baseService.getOnlyOneUser(data.details.user_id).subscribe(result => {
          localStorage.setItem(UsersUtil.CURRENT_USER, JSON.stringify(result));
          localStorage.setItem(UsersUtil.CURRENT_INFO, result.info);
        })
        return JSON.stringify(data);
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          localStorage.removeItem(UsersUtil.CURRENT_USER);
          this.router.navigateByUrl(UrlPathUtil.LOGIN);
          this.matSnackBar.open('Ошибка входа. Проверьте логин и пароль', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
        }
        return throwError(() => error);
      }),

      );
  }

  registrSetDetails(user: User, userLogPas: UserAccess) {
    user.dateOfRegistr = new Date();
    user.avatar = "https://static10.tgstat.ru/channels/_0/64/6471e19cd8c9bbe4fbbd4ec33bf3d1f0.jpg";

    this.addNewUser(user).subscribe(res => {
      if (res.id != null) {
        userLogPas.userId = res.id;
        this.addNewLoginAndPass(userLogPas).subscribe(res => {
          // console.log(res);
        });
      }
    });
  }

  addNewUser(user: User): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<User>(this.usersUrl + '/addUser', user, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.matSnackBar.open('Ошибка 401', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'
          });
        }
        if (error.status === 500) {
          this.matSnackBar.open('Ошибка 500', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'
          });
        }
        return throwError(() => error);
      }),
      map(data => {
        return data;
      })
    );
  }

  addNewLoginAndPass(logAndPass: UserAccess): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(logAndPass);
    const userAccessAndPass: UserAccessAndPassword = {
      userAccess: logAndPass,

      password: logAndPass.password
    };
    return this.http.post<boolean>(this.usersUrl + '/addLoginAndPass', userAccessAndPass, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.matSnackBar.open('Ошибка 401', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'
          });
        }
        if (error.status === 500) {
          this.matSnackBar.open('Ошибка 500', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'
          });
        }
        return throwError(() => error);
      }),
      map(data => {
        if (data == true) {
          this.matSnackBar.open('Регистрация прошла успешно', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'
          });
        } else {this.matSnackBar.open('Пользователь с таким логином уже существует', 'Закрыть', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'
        });}
        return data;
      })
    );
  }

  logoutLogics() {
    return this.logout().subscribe(data => {
      if (data.principal.username != null && data.principal.username != "") {
        localStorage.removeItem(UsersUtil.CURRENT_USER);
        this.router.navigateByUrl(UrlPathUtil.LOGIN);
      }
    });
  }

  logout() : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<any>('api/logout', null, httpOptions).pipe(
      map(data => {
        return data;
      })
    );
  }
}
