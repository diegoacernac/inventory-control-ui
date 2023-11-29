import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { Router } from '@angular/router';
import { ProductInventoryService } from '../../../../services/product-inventory.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './product-inventory-list.component.html',
  styleUrl: './product-inventory-list.component.css',
})
export class ProductInventoryListComponent implements OnInit {
  inventoryData: Array<any> = [];
  create: boolean = true
  edit: boolean = true
  see: boolean = true

  constructor(
    private router: Router,
    private service: ProductInventoryService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.service.getAllActive().subscribe((data: any) => {
      this.inventoryData = data
    })
  }

  addData(): void {
    this.router.navigate(['/add-product-inventory', this.create]);
  }

  getBack(): void {
    this.router.navigate(['/home'])
  }

  seeInformation(id: number): void {
    this.router.navigate([`/info-product-inventory/${this.see}/${id}`])
  }

  update(id: number): void {
    this.router.navigate([`/update-product-inventory/${this.edit}/${id}`])
  }

  delete(id: number): void {
    this.service.inactive(id).subscribe((res: any) => {
      if (res) {
        this.toast.success(
          "Registro eliminado con éxito!",
          "Éxito!",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        )
        this.loadData()
      } else {
        this.toast.error(
          "Error al eliminar el producto.",
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
}
