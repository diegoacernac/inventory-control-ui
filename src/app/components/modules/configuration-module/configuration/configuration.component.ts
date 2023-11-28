import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../pages/header/header.component';
import { FooterComponent } from '../../../../pages/footer/footer.component';
import { UserUtilsService } from '../../../../utils/user-utils.service';
import { HomeOptionsService } from '../../../../services/home-options.service';
import { RoutesEnum } from '../../../enums/routes.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
  CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css',
})
export class ConfigurationComponent implements OnInit {
  userName: string = ''
  routesEnum: Array<any> = []

  constructor(
    private homeOptionsService: HomeOptionsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadHomeOptions()
  }

  loadHomeOptions(): void {
    this.homeOptionsService.getAllOptionsByMenu(RoutesEnum.CONFIGURATION).subscribe((options) => {
      this.routesEnum = options
    })
  }

  goToModule(url: string): void {
    this.router.navigate([`/${url}`])
  }

  getBack(): void {
    this.router.navigate(['/home'])
  }
}
