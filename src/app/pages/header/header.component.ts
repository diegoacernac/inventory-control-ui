import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthService } from '../../services/auth.service'
import { HomeOptionsService } from '../../services/home-options.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isTextVisible: boolean = true
  @Input() isHomePrincipal: boolean = true
  options: Array<any> = []
  see: boolean = true

  constructor(
    private authService: AuthService,
    private homeOptionsService: HomeOptionsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDataOptions()
  }

  loadDataOptions(): void {
    this.homeOptionsService.getAllOptionsByMenu(0).subscribe((options: any) => {
      this.options = options
    })
  }

  goToModule(optionPath: string): void {
    this.router.navigate([`/${optionPath}`])
  }

  seeProfile(): void {
    let id = localStorage.getItem('idUser')
    this.router.navigate([`/profile/${this.see}/${id}`])
  }

  logOut(): void {
    this.authService.logOut()
  }

  onClick(): void {
    this.isTextVisible = !this.isTextVisible;
  }
}
