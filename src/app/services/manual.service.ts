import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../app/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ManualService {

  constants: any = Constants;
  marca: any;
  modelo: any;
  ano: any;
  ano_txt: any;
  versao: any;

  constructor(private http: HttpClient) { }

  setLocal(marca, modelo, ano_txt, ano, versao) {
    this.marca = marca;
    this.modelo = modelo;
    this.ano_txt = ano_txt;
    this.ano = ano;
    this.versao = versao;
  }

  getLocal() {
    const arr = [];

    arr['marca'] = this.marca;
    arr['modelo'] = this.modelo;
    arr['ano'] = this.ano;
    arr['ano_txt'] = this.ano_txt;
    arr['versao'] = this.versao;

    return arr;
  }

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

  itensManualFixoTitulo() {
    return this.http.get(`${this.constants.api}/manual-itens-fixo-titulo`);
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

  saveItemManualTitulo(data) {
    return this.http.post(`${this.constants.api}/add-manual-item`, data);
  }

  getManualCarro(data) {
    return this.http.post(`${this.constants.api}/manual-carro`, data);
  }

  manualCarro(id_marca, id_modelo, ano, id_versao) {
    return this.http.get(`${this.constants.api}/manual-carro/${id_marca}/${id_modelo}/${ano}/${id_versao}`);
  }

  removeManualCarro(id_marca, id_modelo, ano, id_versao) {
    return this.http.delete(`${this.constants.api}/manual-carro/${id_marca}/${id_modelo}/${ano}/${id_versao}`);
  }

  removeItemManualCarro(id, id_marca, id_modelo, ano, id_versao) {
    return this.http.delete(`${this.constants.api}/item-manual-carro/${id}/${id_marca}/${id_modelo}/${ano}/${id_versao}}`);
  }

  editManualCarro(data) {
    return this.http.put(`${this.constants.api}/manual-carro`, data);
  }

  lastManual() {
    return this.http.get(`${this.constants.api}/last-manual`);
  }

  listManual(data) {
    return this.http.post(`${this.constants.api}/list-manual`, data);
  }

  getOptions() {
    return this.http.get(`${this.constants.api}/manual-options`);
  }

  /* Lista de Manutenções */

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

  /* --------- */

  copy(data) {
    return this.http.post(`${this.constants.api}/manual-copy`, data);
  }

  editObservacaoInfo(data) {
    return this.http.put(`${this.constants.api}/manual-observacao-info`, data);
  }

  editObservacaoGeral(data) {
    return this.http.put(`${this.constants.api}/manual-observacao-geral`, data);
  }

  editRodas(data) {
    return this.http.put(`${this.constants.api}/manual-rodas`, data);
  }

  editItemManualTitulo(data) {
    return this.http.put(`${this.constants.api}/manual-item-edit`, data);
  }
}
