import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get(`${this.constants.api}/dashboard`);
  }

  removeProduct(data) {
    return this.http.post(`${this.constants.api}/remove`, data);
  }
}
