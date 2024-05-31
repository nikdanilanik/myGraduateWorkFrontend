import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UrlPathUtil } from '../utils/url-path-util';
import { UsersUtil } from '../utils/users-util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router,) { }

  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate([UrlPathUtil.LOGIN]);
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem(UsersUtil.CURRENT_USER) != null) { return true;}
    return false;
  }

  isAuthenticatedAndNavigate(): void {
    if (localStorage.getItem(UsersUtil.CURRENT_USER) != null) {
      this.router.navigateByUrl(UrlPathUtil.MESSENGE);
    }
  }
}
