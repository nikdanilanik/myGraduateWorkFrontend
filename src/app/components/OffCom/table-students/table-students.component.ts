// import { DialogEditWrapperComponent } from './../dialog-edit-wrapper/dialog-edit-wrapper.component';
// import { MatDialog } from '@angular/material/dialog';
// import { BaseServiceService } from './../../service/base-service.service';
// import { Student } from './../../models/students';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-table-students',
//   templateUrl: './table-students.component.html',
//   styleUrls: ['./table-students.component.css']
// })
// export class TableStudentsComponent implements OnInit {
//   students: Student[];

//   constructor(private baseServiceService: BaseServiceService,
//     public dialog: MatDialog) {
//     this.students = [];
//   }

//   ngOnInit(): void {
//     console.log("TableStudentsComponent");
//     this.baseServiceService.getAllStudents().subscribe(data => this.students = data);
//   }

//   AddNewStudent(): void {
//     const DialogAddingNewStudent =
//       this.dialog.open(DialogEditWrapperComponent, {
//         width: '400px',
//         data: null
//       });
//       DialogAddingNewStudent.afterClosed().subscribe((result: Student) => {
//         if(result != null) {
//           console.log("adding new student: " + result.fio);
//           this.baseServiceService.addNewStudent(result).subscribe(k=>
//             this.baseServiceService.getAllStudents().subscribe(data => this.students = data) );
//         }
//       });
//   }

// }

