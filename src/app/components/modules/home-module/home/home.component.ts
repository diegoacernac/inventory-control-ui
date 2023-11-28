import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { Router } from '@angular/router';
import { HomeOptionsService } from '../../../../services/home-options.service';
import { UserUtilsService } from '../../../../utils/user-utils.service';
import { RoutesEnum } from '../../../enums/routes.enum';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userName: string = ''
  url: string = ''
  routesEnum: Array<any> = []

  constructor(
    private router: Router,
    private homeOptionService: HomeOptionsService,
    private userUtilsService: UserUtilsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userName = this.userUtilsService.getUserName()
    this.loadDataOption()
  }

  loadDataOption(): void {
    let userType = localStorage.getItem('userType')
    if (userType === 'admin') {
      this.homeOptionService.getAllOptionsByMenu(RoutesEnum.HOME).subscribe((options: any) => {
        this.routesEnum = options
      })
    }
  }

  goToModule(url: string): void {
    this.router.navigate([`/${url}`])
  }
}
