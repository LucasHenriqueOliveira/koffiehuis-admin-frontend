import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedIn: boolean;
  navbarOpen = false;
  manutencaoOpen = false;

  constructor(private Auth: AuthService, private router: Router, private Token: TokenService) { }

  ngOnInit() {
    this.Auth.authStatus.subscribe(value => this.loggedIn = value);
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
  }

  toggleManutencao() {
    this.manutencaoOpen = !this.manutencaoOpen;
  }

}
