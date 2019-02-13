import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TituloFixoService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  titulo() {
    return this.http.get(`${this.constants.api}/titulo-fixo`);
  }

  save(data) {
    return this.http.post(`${this.constants.api}/titulo-fixo`, data);
  }

  remove(id) {
    return this.http.delete(`${this.constants.api}/titulo-fixo/${id}`);
  }

  edit(data) {
    return this.http.put(`${this.constants.api}/titulo-fixo`, data);
  }
}
