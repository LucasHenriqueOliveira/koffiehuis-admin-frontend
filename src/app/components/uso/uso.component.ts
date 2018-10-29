import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { UsoService } from 'src/app/services/uso.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-uso-edit-modal',
  template: `
  <form>
  <div class="modal-header">
    <h4 class="modal-title">Editar condição de uso</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
    <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <div class="form-group col-md-12">
      <textarea class="form-control" [(ngModel)]="pergunta" [ngModelOptions]="{standalone: true}"></textarea>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
    <button type="button" (click)="edit(pergunta, id)" class="btn btn-danger" ngbAutofocus>Editar</button>
  </div>
</form>

  `
})
export class ModalUsoEditComponent {
  @Input() pergunta;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(pergunta, id) {
    const data = {
      id: id,
      pergunta: pergunta
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-uso',
  templateUrl: './uso.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./uso.component.css']
})
export class UsoComponent implements OnInit {

  usoForm = new FormGroup({
    pergunta: new FormControl('')
  });
  usoEditForm: any;

  loading = false;
  arrItems: any;
  id: any;

  constructor(private notify: SnotifyService, private Uso: UsoService, private modalService: NgbModal) { }

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

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  openEdit(id, pergunta) {
    const modalRef = this.modalService.open(ModalUsoEditComponent);
    modalRef.componentInstance.pergunta = pergunta;
    modalRef.componentInstance.id = id;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
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

  remove() {
    this.Uso.remove(this.id).subscribe(
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

  edit(data) {
    this.Uso.edit(data).subscribe(
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
