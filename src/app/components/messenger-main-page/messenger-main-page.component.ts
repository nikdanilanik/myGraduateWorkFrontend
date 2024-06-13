import { ChatRoomDTO } from './../../models/dtoFiles/chatRoomDTO';
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
import { ChatRoom } from 'src/app/models/forMessage/chatRoom';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../everything-for-users/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-messenger-main-page',
  templateUrl: './messenger-main-page.component.html',
  styleUrls: ['./messenger-main-page.component.css']
})
export class MessengerMainPageComponent implements AfterViewInit, OnInit {

  dataSource!: MatTableDataSource<User>;
  dataSourceDTO!: MatTableDataSource<ChatRoomDTO>;
  filterData!:string;
  sortData: string = "id, asc";
  displayedColumns: string[] = ['name', 'surname', 'info'];
  currentUser: User = new User();
  users!: User[];
  chatRoomDTOs!: ChatRoomDTO[];
  currentOpenWindow: number = 1;

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
  selectedChatRoomDTO: ChatRoomDTO = new ChatRoomDTO();

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
    protected messageService: MessageService,
    protected dialog: MatDialog,
) {
  this.localStorageService = new LocalStorageService();
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.currentUser.avatar = this.localStorageService.getData(UsersUtil.CURRENT_AVATAR);
    this.currentUser.fio = this.localStorageService.getData(UsersUtil.CURRENT_FIO);
    this.currentUser.id = Number(this.localStorageService.getData(UsersUtil.USER_ID));
    this.currentUser.info = this.localStorageService.getData(UsersUtil.CURRENT_INFO);
  }

  // Для дисконекта, если надо
  // discronectFromWebSocket() {
  //   this.rxStompService.deactivate();
  // }

  // Метод для проверки текущего окна
  checkUsersAndSetWindow(): boolean {
    if (this.users !== undefined && this.currentOpenWindow == 1) {
      return true;
    }
    return false;
  }

  // Первоначальная подгрузка списка юзеров
  ngAfterViewInit() {
    if (!this.prossecingUrl()) {
      this.authGuardService.isAuthenticatedAndNavigate();
      if (this.currentOpenWindow == 1) {
        this.baseServiceService.getAllUsers(this.currentPage, this.pageSize, this.sortData, this.filterData).subscribe((usersPage: Page<User>) => {
          this.dataSource = new MatTableDataSource<User>(usersPage.content);
          this.users = this.dataSource.data;
          this.totalElementsCount = usersPage.totalElements;
          // this.sort.sort({ id: 'id', start: 'asc', disableClear: false });
          this.dataSource.sort = this.sort;
        });
      } else {
        if (this.currentUser && this.currentUser.id !== null) {
          this.messageService.getUserChatRoomDTOs(this.currentUser.id).subscribe((data: ChatRoomDTO[]) => {
            this.dataSourceDTO = new MatTableDataSource<ChatRoomDTO>(data);
            this.dataSourceDTO.sort = this.sort;
            this.chatRoomDTOs = data;
          });
        } else {
          console.error('Current user or user ID is not available');
        }
      }
    }
  }

  onScrollDown() {
    console.log("scrolled down!!");
    this.baseServiceService.getAllUsers(this.currentPage += 1, this.pageSize, this.sortData, this.filterData).subscribe((usersPage: Page<User>) => {
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

  // Вроде как это не нужно
  // loadMoreUsers() {
  //   this.isLoading = true;
  //   this.currentPage++;
  //   this.baseServiceService.getAllUsers(this.currentPage, this.pageSize, "id, asc").subscribe((usersPage: Page<User>) => {
  //     console.log("запуск 2");
  //     const newData = new MatTableDataSource<User>();
  //     newData.data = usersPage.content;
  //     this.dataSource = new MatTableDataSource<User>([...this.dataSource.data, ...newData.data]);
  //     this.totalElementsCount = usersPage.totalElements;
  //     this.isLoading = false;
  // }


  // Если вдруг захочется добавить какие-то параметры в ссылке на странице
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
  handleChatRoomDTOSelected(selectedChatRoomDTO: ChatRoomDTO) {
    const userId = Number(localStorage.getItem(UsersUtil.USER_ID));
    for (let i = 0; i < selectedChatRoomDTO.users.length; i++) {
      if (selectedChatRoomDTO.users.length == 1) {
        this.selectedUser = selectedChatRoomDTO.users[i];
      }
      if (selectedChatRoomDTO.users[i].id !== userId) {
        this.selectedUser = selectedChatRoomDTO.users[i];
      }
    }
    return -1;
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
  chatClick() {
    this.currentOpenWindow = this.currentOpenWindow === 0 ? 1 : 0;
    this.ngAfterViewInit();
  }
  homeClick() {
    this.router.navigateByUrl(UrlPathUtil.HOME);
  }
  exitclick() {
    this.router.navigateByUrl(UrlPathUtil.LOGIN);
    localStorage.clear();
  }
  // Кнопка для редактирования пользовательских данных
  changeUserInfo(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.baseService.updateUser(result).subscribe(updatedUser => {
        });
      }
    });
  }
}
