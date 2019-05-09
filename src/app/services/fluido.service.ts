import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class FluidoService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  fluido() {
    return this.http.get(`${this.constants.api}/fluido`);
  }

  save(data) {
    return this.http.post(`${this.constants.api}/fluido`, data);
  }

  remove(id) {
    return this.http.delete(`${this.constants.api}/fluido/${id}`);
  }

  edit(data) {
    return this.http.put(`${this.constants.api}/fluido`, data);
  }
}
