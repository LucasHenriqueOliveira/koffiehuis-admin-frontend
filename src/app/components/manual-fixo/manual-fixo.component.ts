import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { ManualService } from 'src/app/services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TituloFixoService } from 'src/app/services/titulo-fixo.service';

@Component({
  selector: 'app-manual-fixo-item-edit-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar item do manual fixo</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="item" [ngModelOptions]="{standalone: true}">
        </div>
        <div class="form-group col-sm-12">
          <span>Ideal</span>
        </div>
        <div class="form-group col-sm-6">
          <input type="number" class="form-control" ngbAutofocus [(ngModel)]="km_ideal"
          [ngModelOptions]="{standalone: true}" name="km_ideal" value="" placeholder="Km">
        </div>
        <div class="form-group col-sm-6">
          <input type="number" class="form-control" [(ngModel)]="meses_ideal"
          [ngModelOptions]="{standalone: true}" name="meses_ideal" value="" placeholder="Meses">
        </div>
        <div class="form-group col-sm-12">
          <textarea class="form-control" rows="3" [(ngModel)]="observacao_ideal"
          [ngModelOptions]="{standalone: true}" placeholder="Observação"></textarea>
        </div>
        <div class="form-group col-sm-12">
          <span>Severo</span>
        </div>
        <div class="form-group col-sm-6">
          <input type="number" class="form-control" [(ngModel)]="km_severo"
          [ngModelOptions]="{standalone: true}" name="km_severo" value="" placeholder="Km">
        </div>
        <div class="form-group col-sm-6">
          <input type="number" class="form-control" [(ngModel)]="meses_severo"
          [ngModelOptions]="{standalone: true}" name="meses_severo" value="" placeholder="Meses">
        </div>
        <div class="form-group col-sm-12">
          <textarea class="form-control" rows="3" [(ngModel)]="observacao_severo"
          [ngModelOptions]="{standalone: true}" placeholder="Observação"></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(item, km_ideal, meses_ideal, observacao_ideal,
        km_severo, meses_severo, observacao_severo)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalManualFixoItemEditComponent {
  @Input() item;
  @Input() km_ideal;
  @Input() meses_ideal;
  @Input() observacao_ideal;
  @Input() km_severo;
  @Input() meses_severo;
  @Input() observacao_severo;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) {}

  edit(item, km_ideal, meses_ideal, observacao_ideal, km_severo, meses_severo, observacao_severo) {
    const data = {
      id: this.id,
      item: item,
      km_ideal: km_ideal,
      meses_ideal: meses_ideal,
      observacao_ideal: observacao_ideal,
      km_severo: km_severo,
      meses_severo: meses_severo,
      observacao_severo: observacao_severo
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-manual-fixo',
  templateUrl: './manual-fixo.component.html',
  styleUrls: ['./manual-fixo.component.css']
})
export class ManualFixoComponent implements OnInit {

  itemForm = new FormGroup({
    item: new FormControl(''),
    selectedTitulo: new FormControl(0),
    km_ideal: new FormControl(''),
    meses_ideal: new FormControl(''),
    observacao_ideal: new FormControl(''),
    km_severo: new FormControl(''),
    meses_severo: new FormControl(''),
    observacao_severo: new FormControl(''),
  });
  loading = false;
  arrItems: any;
  arrTitulos: any = [];
  id: any;

  constructor(private notify: SnotifyService, private Manual: ManualService,
    private modalService: NgbModal, private TituloFixo: TituloFixoService) { }

  ngOnInit() {
    this.loading = true;
    this.Manual.itensManualFixoTitulo().subscribe(
      result => {
        this.arrItems = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual fixo', {timeout: 3000, showProgressBar: false });
      }
    );

    this.TituloFixo.titulo().subscribe(
      result => {
        this.loading = false;
        this.arrTitulos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o título', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return this.itemForm.value.item;
  }

  onSubmit() {
    this.loading = true;
    this.Manual.saveItensManualFixo(this.itemForm.value).subscribe(
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
    this.Manual.removeItensManualFixo(this.id).subscribe(
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

  openEdit(id, item, km_ideal, meses_ideal, observacao_ideal, km_severo, meses_severo, observacao_severo) {
    const modalRef = this.modalService.open(ModalManualFixoItemEditComponent);
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.km_ideal = km_ideal;
    modalRef.componentInstance.meses_ideal = meses_ideal;
    modalRef.componentInstance.observacao_ideal = observacao_ideal;
    modalRef.componentInstance.km_severo = km_severo;
    modalRef.componentInstance.meses_severo = meses_severo;
    modalRef.componentInstance.observacao_severo = observacao_severo;
    modalRef.componentInstance.id = id;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Manual.editItensManualFixo(data).subscribe(
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
