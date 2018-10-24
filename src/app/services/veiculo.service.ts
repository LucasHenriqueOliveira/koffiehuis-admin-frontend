import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  marcas() {
    return this.http.get(`${this.baseUrl}/marcas`);
  }

  modelos(data) {
    return this.http.get(`${this.baseUrl}/marcas/${data}`);
  }
}
