import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { OrderDetailService } from '../../../../../services/order-detail.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../../services/product.service';
import { OrderFormComponent } from '../../../order-module/order-actions/order-form/order-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-detail-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-detail-form.component.html',
  styleUrl: './order-detail-form.component.css',
})
export class OrderDetailFormComponent implements OnInit {
  form!: FormGroup;
  userLogin: string = ''
  details: Array<any> = []
  products: Array<any> = []

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
  }

  ngOnInit(): void {
    this.createForm()
    this.loadProducts()
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      product: [''],
      quantity: [null, [Validators.required]],
      measuringUnit: [null, [Validators.required]],
      price: [null, [Validators.required]],
    })
  }

  loadProducts(): void {
    this.productService.getAllActive().subscribe((products: any) => {
      this.products = products
    })
  }

  addElement(): void {
    const data = this.form.getRawValue()
    const producId = this.products.find(p => p.id == data.product)
    let newProduct = {
      ...data,
      name: producId.name
    }
    this.details.push(newProduct)
    this.clearForm()
  }

  deleteRow(id: number): void {
    this.details.splice(id)
  }

  close(): void {
    this.dialogRef.close(this.details)
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
    this.form.get('quantity')?.setValue('')
    this.form.get('measuringUnit')?.setValue('')
    this.form.get('price')?.setValue('')

    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  disabledControls(): void {
    this.form.get('product')?.disable()
    this.form.get('quantity')?.disable()
    this.form.get('price')?.disable()
    this.form.get('measuringUnit')?.disable()
  }
}
