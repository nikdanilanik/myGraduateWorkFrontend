import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent {
  searchText: string = '';

  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSearch(): void {
    this.dialogRef.close(this.searchText);
  }
}
