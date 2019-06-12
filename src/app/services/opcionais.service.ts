import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class OpcionaisService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  opcionais() {
    return this.http.get(`${this.constants.api}/opcional`);
  }

  save(data) {
    return this.http.post(`${this.constants.api}/opcional`, data);
  }

  remove(id) {
    return this.http.delete(`${this.constants.api}/opcional/${id}`);
  }

  edit(data) {
    return this.http.put(`${this.constants.api}/opcional`, data);
  }
}
