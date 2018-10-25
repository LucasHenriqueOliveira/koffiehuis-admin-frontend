import { Component } from '@angular/core';
import { TokenService } from './services/token.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Herbie';

  constructor(private Token: TokenService) { }

  isLoggedIn() {
    return this.Token.loggedIn();
  }
}
