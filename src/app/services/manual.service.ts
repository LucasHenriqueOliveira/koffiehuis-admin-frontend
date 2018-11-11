import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManualService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  save(data) {
    return this.http.post(`${this.baseUrl}/manual`, data);
  }

  remove(id) {
    return this.http.delete(`${this.baseUrl}/manual/${id}`);
  }

  edit(data) {
    return this.http.put(`${this.baseUrl}/manual`, data);
  }

  items() {
    return this.http.get(`${this.baseUrl}/manual`);
  }

  getOptions() {
    return this.http.get(`${this.baseUrl}/manual-options`);
  }

  getItens() {
    return this.http.get(`${this.baseUrl}/manual-item`);
  }

  saveLista(data) {
    return this.http.post(`${this.baseUrl}/manual-item`, data);
  }

  removeItem(id) {
    return this.http.delete(`${this.baseUrl}/manual-item/${id}`);
  }

  editItem(data) {
    return this.http.put(`${this.baseUrl}/manual-item`, data);
  }
}
