import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsoService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get(`${this.baseUrl}/uso`);
  }

  save(data) {
    return this.http.post(`${this.baseUrl}/uso`, data);
  }
}
