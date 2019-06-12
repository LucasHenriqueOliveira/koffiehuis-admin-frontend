import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpcionaisService } from 'src/app/services/opcionais.service';

@Component({
  selector: 'app-opcional-edit-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar opcional</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-7">
          <input type="text" class="form-control" [(ngModel)]="nome" [ngModelOptions]="{standalone: true}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(nome, id)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalOpcionalEditComponent {
  @Input() nome;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(nome, id) {
    const data = {
      id: id,
      nome: nome
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-opcionais',
  templateUrl: './opcionais.component.html',
  styleUrls: ['./opcionais.component.css']
})
export class OpcionaisComponent implements OnInit {

  statusForm = new FormGroup({
    nome: new FormControl('')
  });
  loading = false;
  arrItems: any;
  id: any;

  constructor(private notify: SnotifyService, private Opcionais: OpcionaisService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loading = true;
    this.Opcionais.opcionais().subscribe(
      result => {
        this.loading = false;
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o título', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return this.statusForm.value.nome;
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  openEdit(id, nome) {
    const modalRef = this.modalService.open(ModalOpcionalEditComponent);
    modalRef.componentInstance.nome = nome;
    modalRef.componentInstance.id = id;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Opcionais.edit(data).subscribe(
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
    this.Opcionais.save(this.statusForm.value).subscribe(
      result => {
        this.loading = false;
        this.statusForm.reset();
        this.arrItems = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      err => {
        this.loading = false;
        this.statusForm.reset();
        this.notify.error(err.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  remove() {
    this.Opcionais.remove(this.id).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      err => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(err.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
