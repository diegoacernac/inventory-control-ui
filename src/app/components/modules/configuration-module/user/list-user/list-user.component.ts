import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../pages/header/header.component';
import { FooterComponent } from '../../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css',
})
export class ListUserComponent implements OnInit {
  users: Array<any> = [];
  create: boolean = true
  edit: boolean = true
  see: boolean = true

  constructor(
    private router: Router,
    private service: UserService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.service.getAll().subscribe((users: any) => {
      this.users = users
    })
  }

  addUser(): void {
    this.router.navigate(['/add-user', this.create]);
  }

  getBack(): void {
    this.router.navigate(['/configuration'])
  }

  seeInformation(id: number): void {
    this.router.navigate([`/info-user/${this.see}/${id}`])
  }

  update(id: number): void {
    this.router.navigate([`/update-user/${this.edit}/${id}`])
  }

  delete(id: number): void {
    this.service.delete(id).then((res: any) => {
        this.toastr.success(
          "Registro eliminado con éxito!",
          "Éxito!",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        )
        this.loadUsers()
    }).catch((error: any) => {
      this.toastr.error(
        "Error al eliminar al usuario.",
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
