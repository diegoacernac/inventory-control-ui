import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AlertService } from '../../../../utils/alerts/alert.service'
import { FormActionService } from '../../../../utils/form-actions/form-action.service'
import { AuthService } from '../../../../services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private formActionService: FormActionService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.createForm()
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    })
  }

  login(): void {
    if (this.loginForm.valid) {
      let email = this.loginForm.controls['email'].getRawValue()
      let password = this.loginForm.controls['password'].getRawValue()

      let formControlArray: Array<any> = []
      this.authService.loginWithEmailAndPassword(email, password)
      this.formActionService.clearForm(this.loginForm, formControlArray)
    } else {
      this.loginForm.markAllAsTouched()
    }
  }

  showError(formControlName: string): boolean {
    return this.alertService.showError(formControlName, this.loginForm)
  }

  getErrorMessage(formControlName: string): string {
    const formControl = this.loginForm.get(formControlName)
    return formControl?.hasError('required')
      ? 'Este campo es obligatorio.'
      : formControl?.hasError('email')
      ? 'Ingresa un correo electrónico válido.'
      : formControl?.hasError('minlength')
      ? `La longitud mínima de la contraseña es ${formControl.getError('minlength').requiredLength} caracteres.`
      : '';
  }
}
