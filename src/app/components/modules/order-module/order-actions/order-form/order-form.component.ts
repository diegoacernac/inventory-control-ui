import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { OrderService } from '../../../../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../../../../services/provider.service';
import { StatusEnum } from '../../../../enums/status.enum';
import { OrderDetailFormComponent } from '../../../order-detail-module/order-detail-actions/order-detail-form/order-detail-form.component';
import { DialogService } from '../../../../../utils/dialog.service';
import { OrderDetailService } from '../../../../../services/order-detail.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    OrderDetailFormComponent
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnInit {
  form!: FormGroup;
  orderData: any
  id: number = 0
  create: boolean = false
  edit: boolean = false
  see: boolean = false
  fill: boolean = false
  isComplete: boolean = false
  userLogin: string = ''
  title: string = 'Finalizar Pedido'
  orders: Array<any> = []
  providers: Array<any> = []
  detailsResume: Array<any> = []

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private service: OrderService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private providerService: ProviderService,
    private utils: DialogService,
    private orderDetailService: OrderDetailService,
  ) {
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
  }

  ngOnInit(): void {
    this.createForm()
    this.loadProviders()
    this.loadDefaultData()
    this.validateFlags()
    this.disabledControls()
    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getById()
    }
    this.create ? this.title = 'Nuevo Pedido'
    : this.edit ? this.title = 'Confirmar Pedido'
    : this.see ? this.title = 'Información de Pedido'
    : 'Finalizar Pedido'
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      orderCode: [null],
      provider: ['', [Validators.required]],
      user: [null],
      status: [null],
      registerDate: [null],
      registerUser: [null],
      updateDate: [null],
      updateUser: [null],
    })
  }

  getById(): void {
    const calls = [
      this.service.getById(this.id),
      this.orderDetailService.getAll(),
    ]

    forkJoin(calls).subscribe(([
      order, detail
    ]) => {
      this.orderData = order
      this.form.get('orderCode')?.setValue(this.orderData.orderCode)
      this.form.get('user')?.setValue(this.orderData.user)
      this.form.get('provider')?.setValue(this.orderData.provider.id);
      if (this.see) {
        this.form.get('registerDate')?.setValue(this.datePipe.transform(this.orderData.registerDate, 'yyyy-MM-dd'))
        this.form.get('registerUser')?.setValue(this.orderData.registerUser)
        this.form.get('status')?.setValue(this.orderData.status)
        this.form.get('updateDate')?.setValue(this.datePipe.transform(this.orderData.updateDate, 'yyyy-MM-dd'))
        this.form.get('updateUser')?.setValue(this.orderData.updateUser)
      }

      this.detailsResume = detail.filter((e: any) => e.order.id == this.orderData.id)
    })
  }

  loadProviders(): void {
    this.providerService.getAllActive().subscribe((providers: any) => {
      this.providers = providers
    })
  }

  loadDefaultData(): void {
    this.form.get('user')?.setValue(this.userLogin)
    this.form.get('status')?.setValue('PENDIENTE')
    this.form.get('user')?.disable()
    this.form.get('status')?.disable()
  }

  validateFlags(): void {
    this.create = this.route.snapshot.params['create']
    this.edit = this.route.snapshot.params['edit']
    this.see = this.route.snapshot.params['see']
    this.fill = this.route.snapshot.params['fill']

    if (this.create) {
      this.edit = false
      this.see = false
      this.fill = false
    } else if (this.edit) {
      this.create = false
      this.see = false
      this.fill = false
    } else if (this.see) {
      this.create = false
      this.edit = false
      this.fill = false
    } else {
      this.create = false
      this.edit = false
      this.see = false
    }
  }

  saveOrUpdate(): void {
    if (this.form.valid) {
      const orderHead = {
        provider: {
          id: this.form.controls['provider'].getRawValue(),
        },
        user: this.userLogin,
        registerUser: this.userLogin,
      }

      if (this.id) {
        const orderHeadUpdate = {
          ...orderHead,
          id: this.id,
          orderCode: this.form.get('orderCode')?.getRawValue(),
          status: this.edit ? 'FILLED' : this.fill ?'FINISHED' : 'FILLED',
          updateUser: this.userLogin
        }
        this.service.update(this.id, orderHeadUpdate).subscribe((response: any) => {
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
      } else {
        this.service.save(orderHead).subscribe((response: any) => {
          if (response) {
            this.detailsResume.forEach((detail: any) => {
              const detailObj = {
                price: detail.price,
                quantity: detail.quantity,
                isComplete: false,
                measuringUnit: detail.measuringUnit,
                order: {
                  id: response.id,
                },
                product: {
                  id: detail.product,
                },
                registerUser: this.userLogin,
              }
              this.orderDetailService.save(detailObj).subscribe((details: any) => {
                this.detailsResume = []
                this.getBack()
              })
            })
            this.toastService.success(
              "Pedido registrado con éxito!",
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
              "Error al registrar el pedido.",
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

  completeOrder(detail: any): void {
    const dialogRef = this.utils.openCompleteOrderlDialog(detail)
    dialogRef.afterClosed().subscribe((res: any) => {
      this.orderDetailService.getAll().subscribe((response: any) => {
        this.detailsResume = response.filter((e: any) => e.order.id == this.orderData.id)
      })
    })
  }

  openModal(): void {
    const dialogRef = this.utils.openOrderDetailDialog()
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.detailsResume = res
      }
    })
  }

  getBack(): void {
    this.router.navigate(['/order'])
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
    this.form.get('orderCode')?.setValue('')
    this.form.get('provider')?.setValue('')
    this.form.get('user')?.setValue('')
    this.form.get('status')?.setValue('')

    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  disabledControls(): void {
    if (this.see) {
      this.form.get('orderCode')?.disable()
      this.form.get('provider')?.disable()
      this.form.get('user')?.disable()
      this.form.get('status')?.disable()
      this.form.get('registerDate')?.disable()
      this.form.get('registerUser')?.disable()
      this.form.get('updateDate')?.disable()
      this.form.get('updateUser')?.disable()
    }
  }
}
