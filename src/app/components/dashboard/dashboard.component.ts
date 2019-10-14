import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading = false;
  arrData: any = [];
  id = '';

  constructor(private notify: SnotifyService, private Dashboard: DashboardService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loading = true;

    this.getProdutos();
  }

  getProdutos() {
    this.Dashboard.get().subscribe(
      result => {
        this.loading = false;
        this.arrData = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os dados', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  removeProduct(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  remove() {
    const data = {
      id: this.id
    };
    this.Dashboard.removeProduct(data).subscribe(
      result => {
        this.loading = false;
        this.arrData = result;
        this.modalService.dismissAll();
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error('Erro ao retornar os dados', {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
