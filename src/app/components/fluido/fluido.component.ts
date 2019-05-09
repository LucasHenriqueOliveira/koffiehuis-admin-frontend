import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FluidoService } from 'src/app/services/fluido.service';

@Component({
  selector: 'app-fluido-edit-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar fluído</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="nome" [ngModelOptions]="{standalone: true}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(nome)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalFluidoEditComponent {
  @Input() nome;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(nome) {
    const data = {
      id: this.id,
      nome: nome
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-fluido',
  templateUrl: './fluido.component.html',
  styleUrls: ['./fluido.component.css']
})
export class FluidoComponent implements OnInit {

  fluidoForm = new FormGroup({
    nome: new FormControl('')
  });
  loading = false;
  arrItems: any;
  id: any;

  constructor(private notify: SnotifyService, private modalService: NgbModal, private Fluido: FluidoService) { }

  ngOnInit() {
    this.loading = true;

    this.Fluido.fluido().subscribe(
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
    return this.fluidoForm.value.nome;
  }

  onSubmit() {
    this.loading = true;
    this.Fluido.save(this.fluidoForm.value).subscribe(
      result => {
        this.loading = false;
        this.fluidoForm.reset();
        this.arrItems = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      err => {
        this.loading = false;
        this.fluidoForm.reset();
        this.notify.error(err.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  remove() {
    this.Fluido.remove(this.id).subscribe(
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

  openEdit(id, nome) {
    const modalRef = this.modalService.open(ModalFluidoEditComponent);
    modalRef.componentInstance.nome = nome;
    modalRef.componentInstance.id = id;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Fluido.edit(data).subscribe(
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
