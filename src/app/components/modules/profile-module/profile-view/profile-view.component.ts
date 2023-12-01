import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../utils/alerts/alert.service';
import { ToastrService } from 'ngx-toastr';
import { StatusEnum } from '../../../enums/status.enum';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css',
})
export class ProfileViewComponent implements OnInit {
  form!: FormGroup;
  userData: any
  id: string = ''
  edit: boolean = false
  see: boolean = false
  userLogin: string = ''

  constructor(
    private service: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
  }

  ngOnInit(): void {
    this.createForm()
    this.id = this.route.snapshot.params['id']
    this.validateFlags()
    if (this.id) {
      this.getById()
    }
    this.disabledControls()
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastNane: [null, [Validators.required]],
      dni: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      registerDate: [null],
      registerUser: [null],
      status: [null],
      type: [null]
    })
  }

  getById(): void {
    this.service.getById(this.id).subscribe((user: any) => {
      this.userData = user
      this.form.get('name')?.setValue(this.userData.name)
      this.form.get('lastNane')?.setValue(this.userData.lastNane)
      this.form.get('dni')?.setValue(this.userData.dni)
      this.form.get('email')?.setValue(this.userData.email)
      this.form.get('password')?.setValue('******')
      if (this.see) {
        this.form.get('registerDate')?.setValue(this.datePipe.transform(this.userData.registerDate, 'yyyy-MM-dd'))
        this.form.get('registerUser')?.setValue(this.userData.registerUser)
        this.form.get('status')?.setValue(this.userData.status)
        this.form.get('type')?.setValue(this.userData.type)
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

  toEditMode(): void {
    this.edit = true
    this.see = false
    this.enabledControls()
  }

  toSeeMode(): void {
    this.edit = false
    this.see = true
    this.disabledControls()
  }

  update(): void {
    if (this.form.valid) {
      const {
        name,
        lastNane,
        dni,
        email,
      } = this.form.getRawValue()

      const user = {
        id: this.id,
        name: name,
        lastNane: lastNane,
        dni: dni,
        email: email,
        type: 'admin',
        status: StatusEnum.ACTIVE,
        registerDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        registerUser: this.userLogin,
        updateDate: this.edit ? this.datePipe.transform(new Date(), 'yyyy-MM-dd') : null,
        updateUser: this.edit ? this.userLogin : null,
      }

      if (this.id) {
        this.service.update(this.id, user).then((response: any) => {
          this.toastService.success(
            "Usuario actualizado con éxito!",
            "Éxito!",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-top-right',
            }
          )
          this.clearForm()
          this.getBack()
        }).catch((error) => {
          this.toastService.error(
            "Error al actualizar el usuario.",
            "Error!",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-top-right',
            }
          )
        })
      }
    }
  }

  getBack(): void {
    this.router.navigate(['/user'])
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
    this.form.get('name')?.setValue('')
    this.form.get('lastNane')?.setValue('')
    this.form.get('dni')?.setValue('')
    this.form.get('email')?.setValue('')
    this.form.get('password')?.setValue('')

    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  enabledControls(): void {
    if (this.edit) {
      this.form.get('name')?.enable()
      this.form.get('lastNane')?.enable()
      this.form.get('dni')?.enable()
      this.form.get('email')?.enable()
    }
  }

  disabledControls(): void {
    if (this.see) {
      this.form.get('name')?.disable()
      this.form.get('lastNane')?.disable()
      this.form.get('dni')?.disable()
      this.form.get('email')?.disable()
      this.form.get('password')?.disable()
      this.form.get('registerDate')?.disable()
      this.form.get('registerUser')?.disable()
      this.form.get('status')?.disable()
      this.form.get('type')?.disable()
      this.form.get('updateDate')?.disable()
      this.form.get('updateUser')?.disable()
    }
  }
}
