import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../utils/alerts/alert.service';
import { ProductService } from '../../../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { StatusEnum } from '../../../../enums/status.enum';
import { CategoryService } from '../../../../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  productData: any
  id: number = 0
  create: boolean = false
  edit: boolean = false
  see: boolean = false
  userLogin: string = ''
  title: string = ''
  categories: Array<any> = []

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private service: ProductService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private categoriesService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.loadCategories()
    this.validateFlags()
    this.disabledControls()
    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getById()
    }
    this.userLogin = localStorage.getItem('userName') + ' ' + localStorage.getItem('userLastName')
    this.create ? this.title = 'Nuevo Producto'
    : this.edit ? this.title = 'Editar Registro'
    : this.see ? this.title = 'Información de Producto'
    : ''
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      category: ['', [Validators.required]],
      registerDate: [null],
      registerUser: [null],
      status: [null],
      updateDate: [null],
      updateUser: [null],
    })
  }

  getById(): void {
    this.service.getById(this.id).subscribe((provider: any) => {
      this.productData = provider
      this.form.get('name')?.setValue(this.productData.name)
      this.form.get('description')?.setValue(this.productData.description)
      this.form.get('category')?.setValue(this.productData.category.id);
      if (this.see) {
        this.form.get('registerDate')?.setValue(this.datePipe.transform(this.productData.registerDate, 'yyyy-MM-dd'))
        this.form.get('registerUser')?.setValue(this.productData.registerUser)
        this.form.get('status')?.setValue(this.productData.status)
        this.form.get('updateDate')?.setValue(this.datePipe.transform(this.productData.updateDate, 'yyyy-MM-dd'))
        this.form.get('updateUser')?.setValue(this.productData.updateUser)
      }
    })
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((cat: any) => {
      this.categories = cat
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
      const product = {
        id: this.id ?? 0,
        name: this.form.controls['name'].getRawValue(),
        description: this.form.controls['description'].getRawValue(),
        category: {
          id: this.form.controls['category'].getRawValue(),
        },
        status: StatusEnum.ACTIVE,
        registerUser: this.userLogin,
        updateUser: this.edit ? this.userLogin : null,
      }

      if (this.id) {
        this.service.update(this.id, product).subscribe((response: any) => {
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
        this.service.save(product).subscribe((response: any) => {
          if (response) {
            this.toastService.success(
              "Producto registrado con éxito!",
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
              "Error al registrar el producto.",
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
    this.router.navigate(['/product'])
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
    this.form.get('name')?.setValue('')
    this.form.get('description')?.setValue('')
    this.form.get('category')?.setValue('')

    this.form.markAsPristine()
    this.form.markAsUntouched()
  }

  disabledControls(): void {
    if (this.see) {
      this.form.get('name')?.disable()
      this.form.get('description')?.disable()
      this.form.get('category')?.disable()
      this.form.get('registerDate')?.disable()
      this.form.get('registerUser')?.disable()
      this.form.get('status')?.disable()
      this.form.get('updateDate')?.disable()
      this.form.get('updateUser')?.disable()
    }
  }
}
