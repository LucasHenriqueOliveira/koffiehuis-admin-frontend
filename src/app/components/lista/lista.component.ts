import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ManualService } from 'src/app/services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lista-edit-modal',
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
        <div class="form-group col-md-12">
          <select id="inputManual" class="form-control" [(ngModel)]="id_manual" [ngModelOptions]="{standalone: true}">
            <option *ngFor="let manual of arrManual" [value]="manual.id">{{manual.item}}</option>
          </select>
        </div>
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="nome" [ngModelOptions]="{standalone: true}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(nome, id_manual)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalListaEditComponent {
  @Input() nome;
  @Input() id_manual;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(nome, id_manual) {
    const data = {
      id: this.id,
      nome: nome,
      id_manual: id_manual
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  loading = false;
  arrManual: any = [];
  arrItems: any = [];
  listaForm: any;
  id: any;

  constructor(private notify: SnotifyService, private Manual: ManualService, private modalService: NgbModal) {
    this.getForm();
  }

  getForm() {
    this.listaForm = new FormGroup({
      selectedManual: new FormControl(0),
      item: new FormControl('')
    });
  }

  ngOnInit() {
    this.loading = true;

    this.Manual.getOptions().subscribe(
      result => {
        this.arrManual = result;
      },
      error => {
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );

    this.getItems();
  }

  getItems() {
    this.Manual.getItens().subscribe(
      result => {
        this.loading = false;
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return this.listaForm.value.item && !(this.listaForm.value.selectedManual === 0);
  }

  onSubmit() {
    this.loading = true;
    this.Manual.saveLista(this.listaForm.value).subscribe(
      result => {
        this.getForm();
        this.getItems();
        this.loading = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      err => {
        this.loading = false;
        this.getForm();
        this.notify.error(err.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  remove() {
    this.Manual.removeItem(this.id).subscribe(
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

  openEdit(id, nome, id_manual) {
    const modalRef = this.modalService.open(ModalListaEditComponent);
    modalRef.componentInstance.nome = nome;
    modalRef.componentInstance.id_manual = id_manual;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.arrManual = this.arrManual;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Manual.editItem(data).subscribe(
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
