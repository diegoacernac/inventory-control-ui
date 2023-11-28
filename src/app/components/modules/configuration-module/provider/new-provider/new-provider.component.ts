import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Provider } from '../../../../models/provider.model';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { ProviderService } from '../../../../../services/provider.service';
import { ToastrService } from 'ngx-toastr';
import { StatusEnum } from '../../../../enums/status.enum';

@Component({
  selector: 'app-new-provider',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
 ],
  templateUrl: './new-provider.component.html',
  styleUrl: './new-provider.component.css'
})
export class NewProviderComponent implements OnInit {
  form!: FormGroup;
  providerData: Provider = new Provider()
  currentDate!: Date
  id: number = 0
  create: boolean = false
  edit: boolean = false
  see: boolean = false
  userLogin: string = ''
  title: string = ''

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private providerService: ProviderService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.id = this.route.snapshot.params['id']
    this.validateFlags()
    this.getById()
    this.disabledControls()
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
    this.create ? this.title = 'Nuevo Proveedor'
    : this.edit ? this.title = 'Editar Registro'
    : this.see ? this.title = 'Información de Proveedor'
    : ''
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      description: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.minLength(9)]],
      email: [null, [Validators.required, Validators.email]],
      registerDate: [null],
      registerUser: [null],
      status: [null],
      updateDate: [null],
      updateUser: [null],
    })
  }

  getById(): void {
    this.providerService.getById(this.id).subscribe((provider: any) => {
      this.providerData = provider
      this.form.get('description')?.setValue(this.providerData.description)
      this.form.get('address')?.setValue(this.providerData.address)
      this.form.get('phone')?.setValue(this.providerData.phone)
      this.form.get('email')?.setValue(this.providerData.email)
      if (this.see) {
        this.form.get('registerDate')?.setValue(this.datePipe.transform(this.providerData.registerDate, 'yyyy-MM-dd'))
        this.form.get('registerUser')?.setValue(this.providerData.registerUser)
        this.form.get('status')?.setValue(this.providerData.status)
        this.form.get('updateDate')?.setValue(this.datePipe.transform(this.providerData.updateDate, 'yyyy-MM-dd'))
        this.form.get('updateUser')?.setValue(this.providerData.updateUser)
      }
    })
  }

  validateFlags(): void {
    this.create = this.route.snapshot.params['create']
    this.edit = this.route.snapshot.params['edit']
    this.see = this.route.snapshot.params['see']

    if (this.create) {
      this.edit = false
      this.see = false
    } else if (this.edit) {
      this.create = false
      this.see = false
    } else {
      this.create = false
      this.edit = false
    }
  }

  saveOrUpdate(): void {
    if (this.form.valid) {
      const provider = {
        id: this.providerData.id ?? 0,
        description: this.form.controls['description'].getRawValue(),
        phone: this.form.controls['phone'].getRawValue(),
        address: this.form.controls['address'].getRawValue(),
        email: this.form.controls['email'].getRawValue(),
        status: StatusEnum.ACTIVE,
        registerDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
        registerUser: this.userLogin,
        updateDate: this.edit ? this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') : null,
        updateUser: this.edit ? this.userLogin : null,
      }

      if (this.providerData.id) {
        this.providerService.update(this.id, provider).subscribe((response: any) => {
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
        this.providerService.save(provider).subscribe((response: any) => {
          if (response) {
            this.toastService.success(
              "Proveedor registrado con éxito!",
              "Éxito!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
            )
            this.clearForm()
          } else {
            this.toastService.error(
              "Error al registrar el proveedor.",
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
    this.router.navigate(['/provider'])
  }

  showError(controlName: string): boolean {
    return this.alertService.showError(controlName, this.form)
  }

  getErrorMessage(controlName: string): string {
    const formControl = this.form.get(controlName)
    return formControl?.hasError('required')
      ? 'Este campo es obligatorio.'
      : formControl?.hasError('email')
      ? 'Ingresa un correo electrónico válido.'
      : formControl?.hasError('minlength')
      ? `La longitud mínima para el teléfono es ${formControl.getError('minlength').requiredLength} caracteres.`
      : '';
  }

  clearForm(): void {
    this.form.get('description')?.setValue('')
    this.form.get('address')?.setValue('')
    this.form.get('phone')?.setValue('')
    this.form.get('email')?.setValue('')

    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  disabledControls(): void {
    if (this.see) {
      this.form.get('description')?.disable()
      this.form.get('address')?.disable()
      this.form.get('phone')?.disable()
      this.form.get('email')?.disable()
      this.form.get('registerDate')?.disable()
      this.form.get('registerUser')?.disable()
      this.form.get('status')?.disable()
      this.form.get('updateDate')?.disable()
      this.form.get('updateUser')?.disable()
    }
  }
}
