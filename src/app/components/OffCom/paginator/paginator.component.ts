// import { Component, AfterViewInit, ViewChild } from '@angular/core';
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { ArticleService } from './article.service';
// import { Article } from './article';

// @Component({
//     selector: 'app-paginator',
//     templateUrl: './paginator.component.html'
// })
// export class ArticleComponent implements AfterViewInit {
//     @ViewChild(MatSort) sort: MatSort;
//     @ViewChild(MatPaginator) paginator: MatPaginator;

//     constructor(private articleService: ArticleService) {}

//     pgIndex= 2;
//     firstLastButtons= true;
//     pnDisabled= true;
//     hdPageSize= true;

//     displayedColumns: string[] = ['id', 'title'];
//     dataSource = new MatTableDataSource<Article>(this.articleService.getAllArticles());

//     ngAfterViewInit() {
//       this.dataSource.sort = this.sort;
//       this.dataSource.paginator = this.paginator;
//     }
//     onChangePage(pe:PageEvent) {
//       console.log(pe.pageIndex);
//       console.log(pe.pageSize);
//     }
// }
