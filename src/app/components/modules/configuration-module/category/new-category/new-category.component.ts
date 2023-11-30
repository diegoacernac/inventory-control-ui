import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { FormActionService } from '../../../../../utils/form-actions/form-action.service';
import { ListCategoryComponent } from '../list-category/list-category.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../models/category.model';
import { StatusEnum } from '../../../../enums/status.enum';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css',
})
export class NewCategoryComponent implements OnInit {
  form!: FormGroup
  idModal: string = ''
  categoryData: Category = new Category()

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private formService: FormActionService,
    private dialogRef: MatDialogRef<ListCategoryComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.createForm()
    if (this.data) {
      this.loadCategoryById()
    }
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      description: [null, [Validators.required, this.onlyLetters()]]
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
  
  loadCategoryById(): void {
    this.categoryService.loadCategoryById(this.data.id).subscribe((data:any) => {
      this.categoryData = data
      this.form.get('description')?.setValue(this.categoryData.description)
    })
  }

  saveOrUpdate(): void {
    if (this.form.valid) {
      const category = {
        id: this.categoryData.id ?? 0,
        description: this.form.controls['description'].getRawValue(),
        status: StatusEnum.ACTIVE
      }
      let controlArray: Array<any> = [category.description]

      if (this.categoryData.id) {
        this.categoryService.updateCategory(category.id, category).subscribe((response: any) => {
          if (response) {
            this.toastr.success(
              "Categoría actualizada con éxito!",
              "Éxito!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
            )
            this.formService.clearForm(this.form, controlArray)
            this.dialogRef.close(true)
          } else {
            this.toastr.error(
              "Error al actualizar la categoría.",
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
        this.categoryService.saveCategory(category).subscribe((response: any) => {
          if (response) {
            this.toastr.success(
              "Categoría creada con éxito!",
              "Éxito!",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-top-right',
              }
            )
            this.formService.clearForm(this.form, controlArray)
            this.dialogRef.close(true)
          } else {
            this.toastr.error(
              "Error al crear la categoría.",
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
    this.router.navigate(['/category']);
  }

  showError(formControlName: string): boolean {
    return this.alertService.showError(formControlName, this.form)
  }

  getErrorMessage(formControlName: string): string {
    const formControl = this.form.get(formControlName)
    return formControl?.hasError('required')
      ? 'Este campo es obligatorio.'
      : formControl?.hasError('onlyLetters')
      ? 'Solo se permiten letras en este campo'
      : '';
  }
}
