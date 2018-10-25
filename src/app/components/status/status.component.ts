import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  statusForm = new FormGroup({
    nome: new FormControl(''),
    porcentagem: new FormControl('')
  });
  loading = false;
  arrItems: any;

  constructor(private notify: SnotifyService, private Status: StatusService) { }

  ngOnInit() {
    this.loading = true;
    this.Status.status().subscribe(
      result => {
        this.loading = false;
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o status', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return this.statusForm.value.nome && this.statusForm.value.porcentagem;
  }

  onSubmit() {
    this.loading = true;
    this.Status.save(this.statusForm.value).subscribe(
      result => {
        this.loading = false;
        this.statusForm.reset();
        this.arrItems = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.statusForm.reset();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }
}
