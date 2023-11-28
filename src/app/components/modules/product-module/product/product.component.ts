import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: Array<any> = [];
  create: boolean = true
  edit: boolean = true
  see: boolean = true

  constructor(
    private router: Router,
    private service: ProductService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.service.getAllActive().subscribe((products: any) => {
      this.products = products
    })
  }

  addUser(): void {
    this.router.navigate(['/add-product', this.create]);
  }

  getBack(): void {
    this.router.navigate(['/home'])
  }

  seeInformation(id: number): void {
    this.router.navigate([`/info-product/${this.see}/${id}`])
  }

  update(id: number): void {
    this.router.navigate([`/update-product/${this.edit}/${id}`])
  }

  delete(id: number): void {
    this.service.inactive(id).subscribe(res => {
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
        this.loadProducts()
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
