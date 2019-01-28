import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ManualService {

  constants: any = Constants;

  constructor(private http: HttpClient) { }

  save(data) {
    return this.http.post(`${this.constants.api}/manual`, data);
  }

  remove(id) {
    return this.http.delete(`${this.constants.api}/manual/${id}`);
  }

  edit(data) {
    return this.http.put(`${this.constants.api}/manual`, data);
  }

  items() {
    return this.http.get(`${this.constants.api}/manual`);
  }

  itensManual() {
    return this.http.get(`${this.constants.api}/manual-itens`);
  }

  itensManualFixo() {
    return this.http.get(`${this.constants.api}/manual-itens-fixo`);
  }

  itensManualTitulo(id) {
    return this.http.get(`${this.constants.api}/manual-itens/${id}`);
  }

  saveItensManual(data) {
    return this.http.post(`${this.constants.api}/manual-itens`, data);
  }

  saveItensManualFixo(data) {
    return this.http.post(`${this.constants.api}/manual-itens-fixo`, data);
  }

  removeItensManual(id) {
    return this.http.delete(`${this.constants.api}/manual-itens/${id}`);
  }

  removeItensManualFixo(id) {
    return this.http.delete(`${this.constants.api}/manual-itens-fixo/${id}`);
  }

  editItensManual(data) {
    return this.http.put(`${this.constants.api}/manual-itens`, data);
  }

  editItensManualFixo(data) {
    return this.http.put(`${this.constants.api}/manual-itens-fixo`, data);
  }

  saveManualCarro(data) {
    return this.http.post(`${this.constants.api}/manual-carro`, data);
  }

  manualCarro(modelo) {
    return this.http.get(`${this.constants.api}/manual-carro/${modelo}`);
  }

  removeManualCarro(id_marca, id_modelo, ano, id_versao) {
    return this.http.delete(`${this.constants.api}/manual-carro/${id_marca}/${id_modelo}/${ano}/${id_versao}`);
  }

  editManualCarro(data) {
    return this.http.put(`${this.constants.api}/manual-carro`, data);
  }

  lastManual() {
    return this.http.get(`${this.constants.api}/last-manual`);
  }

  listManual(modelo) {
    return this.http.get(`${this.constants.api}/list-manual/${modelo}`);
  }

  getOptions() {
    return this.http.get(`${this.constants.api}/manual-options`);
  }

  getItens() {
    return this.http.get(`${this.constants.api}/manual-item`);
  }

  saveLista(data) {
    return this.http.post(`${this.constants.api}/manual-item`, data);
  }

  removeItem(id) {
    return this.http.delete(`${this.constants.api}/manual-item/${id}`);
  }

  editItem(data) {
    return this.http.put(`${this.constants.api}/manual-item`, data);
  }
}
