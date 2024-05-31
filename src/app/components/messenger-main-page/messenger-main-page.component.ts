import { MessageService } from 'src/app/service/message.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { BaseServiceService } from './../../service/base-service.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlPathUtil } from 'src/app/utils/url-path-util';
import { UsersUtil } from 'src/app/utils/users-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Page } from 'src/app/models/page';
import { RxStompService } from 'src/app/service/forWebSocket/rx-stompService';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/forMessage/chatMessage';
import { ChatMessageStatus } from 'src/app/models/forMessage/chatMessageStatus';

@Component({
  selector: 'app-messenger-main-page',
  templateUrl: './messenger-main-page.component.html',
  styleUrls: ['./messenger-main-page.component.css']
})
export class MessengerMainPageComponent implements AfterViewInit, OnInit {

  dataSource!: MatTableDataSource<User>;
  filterData!:string;
  displayedColumns: string[] = ['name', 'surname', 'info'];
  currentUser: User = new User();
  users!: User[];

  pgIndex= 2;
  totalElementsCount!: number;
  firstLastButtons= true;
  background_url: string = "src/img/authAvatar.jpg"
  pnDisabled= true;
  hdPageSize= true;

  isLoading: boolean = false;
  currentPage = 0;
  pageSize = 15;

  selectedUser: User = new User();

  chatMessage: ChatMessage = new ChatMessage();

  constructor(protected baseService: BaseServiceService,
    protected baseServiceService: BaseServiceService,
    protected router: Router,
    protected matSnackBar: MatSnackBar,
    protected authService: AuthServiceService,
    protected authGuardService: AuthGuardService,
    protected activatedRoute: ActivatedRoute,
    protected localStorageService: LocalStorageService,
    protected elementRef: ElementRef,
    protected rxStompService: RxStompService,
) {
  this.localStorageService = new LocalStorageService();
    // this.baseService.getAllUsers().subscribe(data => this.users = data);
    // this.currentUser = JSON.parse(localStorage.getItem(UsersUtil.CURRENT_USER) || '{}');
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.currentUser.avatar = this.localStorageService.getData(UsersUtil.CURRENT_AVATAR);
    this.currentUser.fio = this.localStorageService.getData(UsersUtil.CURRENT_FIO);
    // const messageString = JSON.stringify({user: "fio1", type: "join"});
    // this.rxStompService.publish({ destination: '/app/chat.addUser', body: messageString });
  }

  // discronectFromWebSocket() {
  //   this.rxStompService.deactivate();
  // }

  // checkMessageWork() {
  //   this.chatMessage.status = ChatMessageStatus.DELIVERED;

  //   this.baseService.getOnlyOneUser(1).subscribe(res => {
  //     this.chatMessage.user = res;
  //     const chatRoom = {
  //       id: 16,
  //       name: "test",
  //       users: []
  //     };
  //     this.chatMessage.chatRoom = chatRoom;
  //     this.chatMessage.content = "Hello!"
  //     const messageString = JSON.stringify(this.chatMessage); // Преобразуем объект в JSON строку
  //     this.rxStompService.publish({ destination: '/app/chat.addUser', body: messageString });
  //   });
  // }

  ngAfterViewInit() {
    if (!this.prossecingUrl()) {

      this.authGuardService.isAuthenticatedAndNavigate();
      this.baseServiceService.getAllUsers(this.currentPage, this.pageSize, "id, asc").subscribe((usersPage: Page<User>) => {
        this.dataSource = new MatTableDataSource<User>(usersPage.content);
        this.users = this.dataSource.data;
        this.totalElementsCount = usersPage.totalElements;
        // this.sort.sort({ id: 'id', start: 'asc', disableClear: false });
        this.dataSource.sort = this.sort;
      });
    }
  }

  onScrollDown() {
    console.log("scrolled down!!");
    this.baseServiceService.getAllUsers(this.currentPage += 1, this.pageSize, "id, asc").subscribe((usersPage: Page<User>) => {
      // Объединяем содержимое новой страницы пользователей с существующим массивом данных
      this.dataSource.data = this.dataSource.data.concat(usersPage.content);
      this.dataSource = new MatTableDataSource<User>(this.dataSource.data);
      this.users = this.dataSource.data;
      this.totalElementsCount = usersPage.totalElements;
      this.dataSource.sort = this.sort;
    });
  }

  // Работает очень сомнительно. Можно было бы убрать, но чем заменить? И надо ли вообще заменять?
  onScrollUp() {
    console.log("scrolled up!");
    if (this.pageSize*2-1 < this.dataSource.data.length) {
      this.dataSource.data.splice(-this.pageSize);
      this.dataSource = new MatTableDataSource<User>(this.dataSource.data);
      this.currentPage -= 1;
    }
  }

  loadMoreUsers() {
    this.isLoading = true;
    this.currentPage++;
    this.baseServiceService.getAllUsers(this.currentPage, this.pageSize, "id, asc").subscribe((usersPage: Page<User>) => {
      console.log("запуск 2");
      const newData = new MatTableDataSource<User>();
      newData.data = usersPage.content;
      this.dataSource = new MatTableDataSource<User>([...this.dataSource.data, ...newData.data]);
      this.totalElementsCount = usersPage.totalElements;
      this.isLoading = false;
    });
  }

  prossecingUrl() :boolean {
    const thisPageIndex = Number(this.activatedRoute.snapshot.queryParams['thisPageIndex']);
    const thisPageSize  = Number(this.activatedRoute.snapshot.queryParams['thisPageSize']);
    const sortCriterion = this.activatedRoute.snapshot.queryParams['sortCriterion'];
    const filterData    = this.activatedRoute.snapshot.queryParams['filterData'];

    if (thisPageIndex !== 0 && thisPageSize != 5 && sortCriterion != "id, asc" && sortCriterion != undefined || filterData) {
      this.baseServiceService.getAllUsers(thisPageIndex, thisPageSize, sortCriterion, filterData).subscribe((usersPage: Page<User>) => {
        this.paginator.pageIndex = thisPageIndex;
        this.paginator.pageSize = thisPageSize;
        // this.sort..... Не уверен нужен ли
        this.filterData = filterData;
        this.dataSource = new MatTableDataSource<User>(usersPage.content);
        this.totalElementsCount = usersPage.totalElements;
        this.dataSource.sort = this.sort;
        return true;
      });
    }
    return false;
  }

  handleUserSelected(selectedUser: User) {
    this.selectedUser = selectedUser;
  }

  getDataForPage(page: number, size: number, sort: string, filter?: string ) {
    this.baseServiceService.getAllUsers(page, size, sort, filter).subscribe((usersPage: Page<User>) => {
      this.dataSource = new MatTableDataSource<User>(usersPage.content);
      this.totalElementsCount = usersPage.totalElements;
    });
    this.setUrl();
  }

  onChangePage(pe:PageEvent) {
    const sortCriterion = `${this.sort.active},${this.sort.direction}`;
    this.getDataForPage(pe.pageIndex, pe.pageSize, sortCriterion, this.filterData);
  }

  announceSortChange(sortState: Sort) {
    const thisPageIndex = this.paginator.pageIndex;
    const thisPageSize = this.paginator.pageSize;
    const sortCriterion = `${this.sort.active},${this.sort.direction}`;
    this.getDataForPage(thisPageIndex, thisPageSize, sortCriterion, this.filterData);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    const thisPageIndex = this.paginator.pageIndex;
    const thisPageSize = this.paginator.pageSize;
    const sortCriterion = `${this.sort.active},${this.sort.direction}`;
    this.filterData = filterValue;

    if (filterValue === '' && thisPageIndex !== 0) {
      this.paginator.pageIndex = 0;
      this.getDataForPage(thisPageIndex, thisPageSize, sortCriterion);
      return;
    }
    this.getDataForPage(thisPageIndex, thisPageSize, sortCriterion, filterValue);
  }

  setUrl() {
    const currentUrl = this.router.url;
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    const newQueryParams = {
      thisPageIndex: this.paginator.pageIndex,
      thisPageSize: this.paginator.pageSize,
      sortCriterion: `${this.sort.active},${this.sort.direction}`,
      filterData: this.filterData,
    };
    const mergedParams = { ...queryParams, ...newQueryParams };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: mergedParams,
      queryParamsHandling: 'merge'
    });
  }

  homeClick() {
    this.router.navigateByUrl(UrlPathUtil.HOME);
  }
  exitclick() {
    this.router.navigateByUrl(UrlPathUtil.LOGIN);
    localStorage.clear();
  }
}

