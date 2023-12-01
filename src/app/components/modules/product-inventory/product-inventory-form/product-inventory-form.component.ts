import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../utils/alerts/alert.service';
import { ToastrService } from 'ngx-toastr';
import { ProductInventoryService } from '../../../../services/product-inventory.service';

@Component({
  selector: 'app-product-inventory-form',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './product-inventory-form.component.html',
  styleUrl: './product-inventory-form.component.css',
})
export class ProductInventoryFormComponent implements OnInit {
  form!: FormGroup;
  productInventoryData: any
  id: number = 0
  //create: boolean = false
  edit: boolean = false
  see: boolean = false
  userLogin: string = ''
  title: string = ''

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private service: ProductInventoryService,
  ) {
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
  }

  ngOnInit(): void {
    this.createForm()
    this.validateFlags()
    this.disabledControls()
    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getById()
    }
    this.edit ? this.title = 'Editar Registro'
    : this.see ? this.title = 'Información de Registro'
    : ''
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      batch: [null],
      product: [null],
      category: [null],
      dueDate: [null],
      stock: [null, [Validators.required]],
      measuringUnit: [null],
      purchasePrice: [null],
      salePrice: [null],
      registerDate: [null],
      registerUser: [null],
      status: [null],
      updateDate: [null],
      updateUser: [null],
    })
  }

  getById(): void {
    this.service.getById(this.id).subscribe((data: any) => {
      this.productInventoryData = data
      this.form.get('batch')?.setValue(this.productInventoryData.batch)
      this.form.get('product')?.setValue(this.productInventoryData.product.name)
      this.form.get('category')?.setValue(this.productInventoryData.product.category.description);
      this.form.get('dueDate')?.setValue(this.productInventoryData.dueDate)
      this.form.get('stock')?.setValue(this.productInventoryData.stock)
      this.form.get('measuringUnit')?.setValue(this.productInventoryData.measuringUnit)
      this.form.get('purchasePrice')?.setValue(this.productInventoryData.purchasePrice)
      this.form.get('salePrice')?.setValue(this.productInventoryData.salePrice)
      if (this.see) {
        this.form.get('registerDate')?.setValue(this.datePipe.transform(this.productInventoryData.registerDate, 'yyyy-MM-dd'))
        this.form.get('registerUser')?.setValue(this.productInventoryData.registerUser)
        this.form.get('status')?.setValue(this.productInventoryData.status)
        this.form.get('updateDate')?.setValue(this.datePipe.transform(this.productInventoryData.updateDate, 'yyyy-MM-dd'))
        this.form.get('updateUser')?.setValue(this.productInventoryData.updateUser)
      }
    })
  }

  validateFlags(): void {
    this.edit = this.route.snapshot.params['edit']
    this.see = this.route.snapshot.params['see']

    if (this.edit) {
      this.see = false
    } else {
      this.edit = false
    }
  }

  update(): void {
    if (this.form.valid) {
      const product = {
        id: this.id ?? 0,
        batch: this.form.controls['batch'].getRawValue(),
        product: {
          id: this.productInventoryData.product.id,
        },
        category: {
          id: this.productInventoryData.product.category.id,
        },
        dueDate: this.form.controls['dueDate'].getRawValue(),
        stock: this.form.controls['stock'].getRawValue(),
        measuringUnit: this.form.controls['measuringUnit'].getRawValue(),
        purchasePrice: this.form.controls['purchasePrice'].getRawValue(),
        salePrice: this.form.controls['salePrice'].getRawValue(),
        registerDate: this.productInventoryData.registerDate,
        registerUser: this.productInventoryData.registerUser,
        status: this.productInventoryData.status,
        updateUser: this.userLogin,
      }

      if (this.id) {
        this.service.update(this.id, product).subscribe((response: any) => {
          if (response) {
            this.toastService.success(
              "Registro actualizado con éxito!",
              "Éxito!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
            )
            this.clearForm()
            this.getBack()
          } else {
            this.toastService.error(
              "Error al actualizar el registro.",
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
  }

  getBack(): void {
    this.router.navigate(['/product-inventory'])
  }

  showError(controlName: string): boolean {
    return this.alertService.showError(controlName, this.form)
  }

  getErrorMessage(controlName: string): string {
    const formControl = this.form.get(controlName)
    return formControl?.hasError('required')
      ? 'Este campo es obligatorio.'
      : '';
  }

  clearForm(): void {
    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  disabledControls(): void {
    this.form.get('batch')?.disable()
    this.form.get('product')?.disable()
    this.form.get('category')?.disable()
    this.form.get('dueDate')?.disable()
    this.form.get('purchasePrice')?.disable()
    this.form.get('salePrice')?.disable()
    this.form.get('registerDate')?.disable()
    this.form.get('registerUser')?.disable()
    this.form.get('status')?.disable()
    this.form.get('updateDate')?.disable()
    this.form.get('updateUser')?.disable()
    this.form.get('stock')?.disable()
    this.form.get('measuringUnit')?.disable()

    if (this.edit) {
      this.form.get('stock')?.enable()
    }
  }
}
