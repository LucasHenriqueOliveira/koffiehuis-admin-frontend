import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form = {
    email: null,
    password: null
  };

  public error = null;
  loading = false;
  ngZone: any;

  constructor(private User: UserService, private Token: TokenService, private router: Router, private Auth: AuthService) { }

  onSubmit() {
    this.loading = true;
    this.User.login(this.form).subscribe(
      data => this.handleResponse(data),
      error => {
        this.loading = false;
        this.handleError(error);
      }
    );
  }

  handleResponse(data) {
    this.Token.handle(data.access_token, data.user);
    this.Auth.changeAuthStatus(true);
    this.router.navigateByUrl('/dashboard');
  }

  handleError(error) {
    this.error = error.error.error;
  }

  ngOnInit() {
  }

}
