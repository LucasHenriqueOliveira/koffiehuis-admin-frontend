import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post(`${this.constants.api}/login`, data);
  }
}
