import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { OrderFormComponent } from '../../../order-module/order-actions/order-form/order-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../../../services/product.service';
import { ProductInventoryService } from '../../../../../services/product-inventory.service';
import { OrderDetailService } from '../../../../../services/order-detail.service';

@Component({
  selector: 'app-order-detail-form-complete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './order-detail-form-complete.component.html',
  styleUrl: './order-detail-form-complete.component.css',
})
export class OrderDetailFormCompleteComponent implements OnInit {
  form!: FormGroup
  marginPercentPrice: number = 0
  userLogin: string = ''
  productInventory: Array<any> = []
  batch: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ProductInventoryService,
    private orderDetailService: OrderDetailService,
    private productInventoryService: ProductInventoryService,
  ) {
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
  }

  ngOnInit(): void {
    this.createForm()
    this.disabledControls()
    this.loadData()
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      product: [null, [Validators.required]],
      batch: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      price: [null, [Validators.required]],
      salePrice: [null, [Validators.required]]
    })
  }

  loadData(): void {
    console.log(this.data)
    this.productInventoryService.getAll().subscribe((res: any) => {
      this.productInventory = res
      this.form.get('product')?.setValue(this.data.obj.product.name)
      this.form.get('batch')?.setValue(this.generateBatch())
      this.form.get('price')?.setValue('S/.' + this.data.obj.price)
    })
  }

  generateBatch(): string {
    const ultimoLote = this.productInventory.length > 0 ? this.productInventory[this.productInventory.length - 1].batch : '00';
    const currentBatchNumber = parseInt(ultimoLote.substring(ultimoLote.length - 2));
    const newBatchNumber = currentBatchNumber + 1;
    const formattedNewBatchNumber = this.zeroToFront(newBatchNumber);
    const registerOrderDate = new Date(this.data.obj.registerDate);
    const productId = this.zeroToFront(this.data.obj.product.id);

    return this.batch = `LT-${this.dateFormat(registerOrderDate)}-PR${productId}-${formattedNewBatchNumber}`
  }

  private dateFormat(date: Date): string {
    const año = date.getFullYear()
    const mes = this.zeroToFront(date.getMonth() + 1)
    const dia = this.zeroToFront(date.getDate())

    return `${año}${mes}${dia}`
  }

  private zeroToFront(number: number): string {
    return number < 10 ? `0${number}` : `${number}`
  }

  calculateSalePrice(): void {
    let price = this.data.obj.price
    let margin = this.marginPercentPrice
    let result = price + (price * (margin / 100))
    this.form.get('salePrice')?.setValue(result)
  }

  save(): void {
    const productInventoryObj = {
      product: {
        id: this.data.obj.product.id
      },
      stock: this.data.obj.quantity,
      measuringUnit: this.data.measuringUnit,
      batch: this.form.get('batch')?.getRawValue(),
      purchasePrice: this.data.obj.price,
      salePrice: this.form.get('salePrice')?.getRawValue(),
      dueDate: this.form.get('dueDate')?.getRawValue(),
      registerUser: this.userLogin
    }

    if (this.form.valid) {
      this.service.save(productInventoryObj).subscribe((res: any) => {
        if (res) {
          const objDetail = {
            ...this.data.obj,
            isComplete: true
          }
          this.orderDetailService.update(this.data.obj.id, objDetail).subscribe((res: any) => {
            console.log('ok')
          })
          this.dialogRef.close()
        }
      })
    }
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
    this.form.get('product')?.setValue('')
    this.form.get('batch')?.setValue('')
    this.form.get('salePrice')?.setValue('')
    this.form.get('price')?.setValue('')
    this.form.get('dueDate')?.setValue('')

    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  disabledControls(): void {
    this.form.get('product')?.disable()
    this.form.get('batch')?.disable()
    this.form.get('price')?.disable()
    this.form.get('salePrice')?.disable()
  }

  activeControl(): void {
    this.form.get('salePrice')?.enable()
  }
}
