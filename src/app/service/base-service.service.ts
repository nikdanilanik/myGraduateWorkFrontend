import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlPathUtil } from 'src/app/utils/url-path-util';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UsersUtil } from '../utils/users-util';
import { Page } from '../models/page';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class BaseServiceService {
  private usersUrl = 'api/base/users';

  constructor(private http: HttpClient,
    private matSnackBar: MatSnackBar,
    private router: Router) {
  }

  getAllUsers(page: number, size: number, sort: string, filter?: string): Observable<Page<User>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());
      if (sort) {
        params = params.set("sort", sort);
      }
      if (filter) {
        params = params.set("filter", filter);
      }

    return this.http.get<Page<User>>(`${this.usersUrl}`, {params}).pipe(
      map((data:any) => {
        return data;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          localStorage.removeItem(UsersUtil.CURRENT_USER);
          this.router.navigateByUrl(UrlPathUtil.LOGIN);
          this.matSnackBar.open('Ошибка входа. Пожалуйста, повторите авторизацию', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
        }
        return throwError(() => error);
      })
    );
  }

  addNewUser(user: User): Observable<User> {
    console.log('addNewUser');
    return this.http.post<User>("api/base/users", user).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.matSnackBar.open('Ошибка 401', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
        }
        if (error.status === 500) {
          this.matSnackBar.open('Ошибка 500', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
        }
        return throwError(() => error);
      }),
      map(data => {
        console.log(data);
        return data;
      })
    );
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.usersUrl}/update`;
    return this.http.put<User>(url, user).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          localStorage.removeItem(UsersUtil.CURRENT_USER);
          this.router.navigateByUrl(UrlPathUtil.LOGIN);
          this.matSnackBar.open('Ошибка входа. Пожалуйста, повторите авторизацию', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
        }
        return throwError(() => error);
      }),
      map((data:User) => {
        localStorage.setItem(UsersUtil.CURRENT_USER, JSON.stringify(data));
        localStorage.setItem(UsersUtil.CURRENT_INFO, data.info);
        return data;
      })
    )
  }

  getOnlyOneUser(id: number) : Observable<User>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.get<User>(`${this.usersUrl}/${id}`, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          localStorage.removeItem(UsersUtil.CURRENT_USER);
          this.router.navigateByUrl(UrlPathUtil.LOGIN);
          this.matSnackBar.open('Ошибка входа. Пожалуйста, повторите авторизацию', 'Закрыть', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' });
        }
        return throwError(() => error);
      }),
      map((data:User) => {
        // console.log(data);
        return data;
      })
    );
  }

  // загрузка файлов
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Используйте HttpClient для отправки запроса
    this.http.post('api/base/upload', formData).subscribe(response => {
      console.log('File uploaded successfully', response);
    }, error => {
      console.error('File upload failed', error);
    });
  }
}
