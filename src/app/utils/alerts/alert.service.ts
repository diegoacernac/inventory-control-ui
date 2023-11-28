import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showError(formControlName: string, form: FormGroup): boolean {
    const formControl = form.get(formControlName)
    return formControl!.invalid && (formControl!.dirty || formControl!.touched)
  }
}
