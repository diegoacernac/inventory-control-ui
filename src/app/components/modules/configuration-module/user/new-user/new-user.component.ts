import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../services/auth.service';
import { StatusEnum } from '../../../../enums/status.enum';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {
  form!: FormGroup;
  userData: any
  id: string = ''
  create: boolean = false
  edit: boolean = false
  see: boolean = false
  userLogin: string = ''
  title: string = ''

  constructor(
    private service: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.id = this.route.snapshot.params['id']
    this.validateFlags()
    if (this.id) {
      this.getById()
    }
    this.disabledControls()
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
    this.create ? this.title = 'Nuevo Usuario'
    : this.edit ? this.title = 'Editar Registro'
    : this.see ? this.title = 'Información de Usuario'
    : ''
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, this.onlyLetters()]],
      lastNane: [null, [Validators.required, this.onlyLetters()]],
      dni: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8), this.onlyNumbers()]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      registerDate: [null],
      registerUser: [null],
      status: [null],
      type: [null],
      updateDate: [null],
      updateUser: [null],
    })
  }

  onlyLetters() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const onlyLettersRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/u;
      if (control.value && !onlyLettersRegex.test(control.value)) {
        return { 'onlyLetters': true };
      }
      return null;
    };
  }

  onlyNumbers() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const onlyNumbersRegex = /^[0-9]+$/;  
      if (control.value && !onlyNumbersRegex.test(control.value)) {
        return { 'onlyNumbers': true };
      }
  
      return null;
    };
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
        this.form.get('updateDate')?.setValue(this.datePipe.transform(this.userData.updateDate, 'yyyy-MM-dd'))
        this.form.get('updateUser')?.setValue(this.userData.updateUser) ?? 'Sin ediciones aún.'
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
      const {
        name,
        lastNane,
        dni,
        email,
        password,
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
      } else {
        this.authService.signUpWithEmailAndPassword(email, password).then((response: any) => {
          const user = {
            id: response,
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

          this.service.save(user).then((response: any) => {
            this.toastService.success(
              "Usuario registrado con éxito!",
              "Éxito!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
            )
            this.clearForm()
            this.getBack()
          })
          .catch((error) => {
            this.toastService.error(
              "Error al registrar el registro.",
              "Error!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
            )
          })
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
      : formControl?.hasError('onlyLetters')
      ? 'Solo se permiten letras en este campo'
      : formControl?.hasError('email')
      ? 'Ingresa un correo electrónico válido.'
      : formControl?.hasError('minlength')
      ? `La longitud mínima para el DNI es ${formControl.getError('minlength').requiredLength} caracteres.`
      : formControl?.hasError('onlyNumbers')
      ? 'Solo se permiten números en este campo'
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
