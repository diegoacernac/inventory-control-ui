import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { NewProviderComponent } from '../new-provider/new-provider.component';
import { ProviderService } from '../../../../../services/provider.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-provider',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    NewProviderComponent,
 ],
  templateUrl: './list-provider.component.html',
  styleUrl: './list-provider.component.css',
})
export class ListProviderComponent implements OnInit {
  providers: Array<any> = []
  create: boolean = true
  edit: boolean = true
  see: boolean = true

  constructor(
    private router: Router,
    private service: ProviderService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadProviders()
  }

  loadProviders(): void {
    this.service.getAllActive().subscribe((providers: any) => {
      this.providers = providers
    })
  }

  getBack(): void {
    this.router.navigate(['/configuration'])
  }

  addProvider(): void {
    this.router.navigate(['/add-provider', this.create])
  }

  seeInformation(id: number): void {
    this.router.navigate([`/info-provider/${this.see}/${id}`])
  }

  update(id: number): void {
    this.router.navigate([`/update-provider/${this.edit}/${id}`])
  }

  delete(id: number): void {
    this.service.inactive(id).subscribe(res => {
      if (res) {
        this.toastr.success(
          "Proveedor eliminado con éxito!",
          "Éxito!",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        )
        this.loadProviders()
      } else {
        this.toastr.error(
          "Error al eliminar al proveedor.",
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
