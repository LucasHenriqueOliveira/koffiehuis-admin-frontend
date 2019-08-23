import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  grupo() {
    return this.http.get(`${this.constants.api}/grupo`);
  }

  save(data) {
    return this.http.post(`${this.constants.api}/grupo`, data);
  }

  remove(id) {
    return this.http.delete(`${this.constants.api}/grupo/${id}`);
  }

  edit(data) {
    return this.http.put(`${this.constants.api}/grupo`, data);
  }
}
