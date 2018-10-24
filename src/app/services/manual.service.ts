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

  items() {
    return this.http.get(`${this.baseUrl}/manual`);
  }
}
