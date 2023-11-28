import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormActionService {

  constructor() { }

  clearForm(form: FormGroup, formControlArray: Array<string>): void {
    formControlArray.forEach(controls => {
      form.get(controls)?.setValue('')
    })
    form.markAsPristine()
    form.markAsUntouched()
  }
}
