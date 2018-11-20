import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ManualService } from 'src/app/services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-item-edit-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar item do manual</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="item" [ngModelOptions]="{standalone: true}">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(item)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalManualItemEditComponent {
  @Input() item;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(item) {
    const data = {
      id: this.id,
      item: item
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  itemForm = new FormGroup({
    item: new FormControl(''),
  });
  loading = false;
  arrItems: any;
  id: any;

  constructor(private notify: SnotifyService, private Manual: ManualService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loading = true;
    this.Manual.itensManual().subscribe(
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
    return this.itemForm.value.item;
  }

  onSubmit() {
    this.loading = true;
    this.Manual.saveItensManual(this.itemForm.value).subscribe(
      result => {
        this.loading = false;
        this.itemForm.reset();
        this.arrItems = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      err => {
        this.loading = false;
        this.itemForm.reset();
        this.notify.error(err.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  remove() {
    this.Manual.removeItensManual(this.id).subscribe(
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

  openEdit(id, item) {
    const modalRef = this.modalService.open(ModalManualItemEditComponent);
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.id = id;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Manual.editItensManual(data).subscribe(
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
