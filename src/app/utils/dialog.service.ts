import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../components/modules/configuration-module/category/new-category/new-category.component';
import { OrderDetailFormComponent } from '../components/modules/order-detail-module/order-detail-actions/order-detail-form/order-detail-form.component';
import { OrderDetailFormCompleteComponent } from '../components/modules/order-detail-module/order-detail-actions/order-detail-form-complete/order-detail-form-complete.component';
import { ConfirmationDialogComponent } from '../components/dialog/confirmation-dialog/confirmation-dialog.component';

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
    })
  }

  openCategoryDialogWithId(id: number) {
    return this.dialog.open(NewCategoryComponent, {
      width: "700px",
      height: "450px",
      disableClose: false,
      data: {
        id: id
      }
    })
  }

  openOrderDetailDialog() {
    return this.dialog.open(OrderDetailFormComponent, {
      width: "900px",
      height: "755px",
      disableClose: false,
      data: {
        data: []
      }
    })
  }

  openCompleteOrderlDialog(detail: any) {
    return this.dialog.open(OrderDetailFormCompleteComponent, {
      width: "1000px",
      height: "800px",
      disableClose: false,
      data: {
        obj: detail
      }
    })
  }

  openConfirmationDialog(title: string, message: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      height: "250px",
      disableClose: true,
    })
  }
}
