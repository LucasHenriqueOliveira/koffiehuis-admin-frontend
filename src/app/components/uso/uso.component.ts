import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { UsoService } from 'src/app/services/uso.service';

@Component({
  selector: 'app-uso',
  templateUrl: './uso.component.html',
  styleUrls: ['./uso.component.css']
})
export class UsoComponent implements OnInit {

  usoForm = new FormGroup({
    pergunta: new FormControl('')
  });
  loading = false;
  arrItems: any;

  constructor(private notify: SnotifyService, private Uso: UsoService) { }

  ngOnInit() {
    this.loading = true;
    this.Uso.get().subscribe(
      result => {
        this.loading = false;
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar as perguntas de condições de uso', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onSubmit() {
    this.loading = true;
    this.Uso.save(this.usoForm.value).subscribe(
      result => {
        this.loading = false;
        this.usoForm.reset();
        this.arrItems = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.usoForm.reset();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
