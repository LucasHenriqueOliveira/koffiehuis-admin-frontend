import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  listaForm = new FormGroup({
    lista: new FormControl('')
  });
  loading = false;

  constructor(private notify: SnotifyService) { }

  ngOnInit() {
  }

}
