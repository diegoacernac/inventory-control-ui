import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../components/modules/configuration-module/category/new-category/new-category.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog
  ) {}

  openCategoryDialog() {
    return this.dialog.open(NewCategoryComponent, {
      width: "700px",
      height: "450px",
      disableClose: false,
    });
  }

  openCategoryDialogWithId(id: number) {
    return this.dialog.open(NewCategoryComponent, {
      width: "700px",
      height: "450px",
      disableClose: false,
      data: {
        id: id
      }
    });
  }
}
