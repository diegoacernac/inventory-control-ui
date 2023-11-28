import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: Array<any> = [];
  create: boolean = true
  edit: boolean = true
  see: boolean = true

  constructor(
    private router: Router,
    private toast: ToastrService,
    private service: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.service.getAll().subscribe((orders: any) => {
      this.orders = orders
    })
  }

  addUser(): void {
    this.router.navigate(['/add-order', this.create]);
  }

  getBack(): void {
    this.router.navigate(['/home'])
  }

  seeInformation(id: number): void {
    this.router.navigate([`/info-order/${this.see}/${id}`])
  }

  update(id: number): void {
    this.router.navigate([`/update-order/${this.edit}/${id}`])
  }
}
