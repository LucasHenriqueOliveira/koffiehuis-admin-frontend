import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { StatusService } from 'src/app/services/status.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-status-edit-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar status</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-7">
          <input type="text" class="form-control" [(ngModel)]="nome" [ngModelOptions]="{standalone: true}">
        </div>
        <div class="form-group col-md-3">
          <input type="number" class="form-control" [(ngModel)]="porcentagem" [ngModelOptions]="{standalone: true}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(nome, porcentagem, id)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalStatusEditComponent {
  @Input() nome;
  @Input() porcentagem;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(nome, porcentagem, id) {
    const data = {
      id: id,
      nome: nome,
      porcentagem: porcentagem
    };
    this.activeModal.close(data);
  }
}

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
  id: any;

  constructor(private notify: SnotifyService, private Status: StatusService, private modalService: NgbModal) { }

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

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  openEdit(id, nome, porcentagem) {
    const modalRef = this.modalService.open(ModalStatusEditComponent);
    modalRef.componentInstance.nome = nome;
    modalRef.componentInstance.porcentagem = porcentagem;
    modalRef.componentInstance.id = id;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Status.edit(data).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
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

  remove() {
    this.Status.remove(this.id).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }
}
