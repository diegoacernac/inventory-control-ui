import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatDialogModule } from '@angular/material/dialog'
import { DialogService } from '../../../../../utils/dialog.service';
import { CategoryService } from '../../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    NewCategoryComponent,
    MatDialogModule
 ],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css'
})
export class ListCategoryComponent  implements OnInit {
  categories: Array<any> = []
  closeModal: boolean = true

  constructor(
    private router: Router,
    private utils: DialogService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadCategories()
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories: Array<any>) => {
      this.categories = categories;
    })
  }

  addCategory(): void {
    this.router.navigate(['/add-category'])
  }

  getBack(): void {
    this.router.navigate(['/configuration'])
  }

  update(id: number): void {
    const dialogRef = this.utils.openCategoryDialogWithId(id)
    dialogRef.afterClosed().subscribe(res => {
      this.loadCategories()
    })
  }

  delete(id: number): void {
    this.categoryService.inactiveCategory(id).subscribe(res => {
      if (res) {
        this.toastr.success(
          "Categoría eliminada con éxito!",
          "Éxito!",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        )
        this.loadCategories()
      } else {
        this.toastr.error(
          "Error al eliminar la categoría.",
          "Error!",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        )
      }
    })
  }

  openModal(): void {
    const dialogRef = this.utils.openCategoryDialog()
    dialogRef.afterClosed().subscribe(res => {
      this.loadCategories()
    })
  }
}
