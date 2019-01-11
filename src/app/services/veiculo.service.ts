import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  marcas() {
    return this.http.get(`${this.constants.api}/marcas`);
  }

  modelos(data) {
    return this.http.get(`${this.constants.api}/marcas/${data}`);
  }

  anos(data) {
    return this.http.get(`${this.constants.api}/anos/${data}`);
  }

  versoes(data) {
    return this.http.get(`${this.constants.api}/versao/${data}`);
  }

  getCars() {
    return this.http.get(`${this.constants.api}/carro`);
  }
}
