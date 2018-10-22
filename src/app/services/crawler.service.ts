import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  marcas() {
    return this.http.get('http://fipeapi.appspot.com/api/1/carros/marcas.json');
  }

  save(data) {
    return this.http.post(`${this.baseUrl}/crawler`, data);
  }
}
