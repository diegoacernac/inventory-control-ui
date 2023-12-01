import { Component, Inject, OnInit } from '@angular/core';
import { ListCategoryComponent } from '../../modules/configuration-module/category/list-category/list-category.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent implements OnInit {
  confirmDelete: boolean = false
  title: string = ''

  constructor(
    private dialogRef: MatDialogRef<ListCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {

  }

  toDelete(): void {
    this.confirmDelete = true
    this.dialogRef.close(this.confirmDelete)
  }

  closeModal(): void {
    this.confirmDelete = false
    this.dialogRef.close(this.confirmDelete)
  }
}
