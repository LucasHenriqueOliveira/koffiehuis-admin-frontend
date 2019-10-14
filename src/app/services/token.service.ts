import { Injectable } from '@angular/core';
import { Constants } from '../../app/app-constants';

@Injectable()
export class TokenService {

  constants: any = Constants;
  private iss = {
    login: `${this.constants.api}/login`,
    signup: `${this.constants.api}/signup`
  };

  constructor() { }

  handle(token, user) {
    this.set(token, user);
  }

  set(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  get() {
    return localStorage.getItem('token');
  }

  remove() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isValid() {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        // let url = payload.iss.split(':');
        // url = 'https:' + url[1];
        // url = 'http:' + url[1];
        // console.log(this.iss);
        // return Object.values(this.iss).indexOf(url) > -1 ? true : false;
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }
    return false;
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValid();
  }
}
