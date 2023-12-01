import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../services/product.service';
import { OrderDetailService } from '../../../../services/order-detail.service';
import { DialogService } from '../../../../utils/dialog.service';

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
    private toastr: ToastrService,
    private detailService: OrderDetailService,
    private utils: DialogService,
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
    let detailArray: Array<any> = []
    this.detailService.getAll().subscribe((details: any) => {
      detailArray = details;
      let idFind = detailArray.find(e => e.product.id && e.product.id == id)

      if (idFind && idFind.product) {
        this.toastr.error(
          "No puedes eliminar este registro, debido a que está asociado a algunos pedidos.",
              "Error!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
        )
      } else {
        const dialog = this.utils.openConfirmationDialog('ELiminar', '¿Desea eliminar este registro?')
        dialog.afterClosed().subscribe(result => {
          if (result) {
            this.service.inactive(id).subscribe(res => {
              if (res) {
                this.toastr.success(
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
                this.toastr.error(
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
        })
      }
    })
  }
}
