import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UrlPathUtil } from 'src/app/utils/url-path-util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(private router: Router,
    private matSnackBar: MatSnackBar) {
  }
  authClick() {
    this.router.navigateByUrl(UrlPathUtil.LOGIN);
  }
  registr() {
    this.router.navigateByUrl(UrlPathUtil.REGISTRATION);
  }
}
