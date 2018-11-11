import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
        <div class="form-group col-md-4">
          <select id="inputMarcas" class="form-control" [(ngModel)]="id_marca"
          [ngModelOptions]="{standalone: true}" (change)="onChange(id_marca)">
            <option *ngFor="let marca of arrMarcas" [value]="marca.id">{{marca.nome}}</option>
          </select>
        </div>
        <div class="form-group col-md-8">
          <select id="inputModelos" class="form-control" [(ngModel)]="id_modelo" [ngModelOptions]="{standalone: true}">
            <option selected value="0">Selecione o modelo</option>
            <option *ngFor="let modelo of arrModelos" [value]="modelo.id">{{modelo.nome}}</option>
          </select>
        </div>
        <div class="form-group col-md-8">
          <input type="text" class="form-control" placeholder="Informe o item"
          [(ngModel)]="item" [ngModelOptions]="{standalone: true}" required>
        </div>
        <div class="form-group col-md-2">
          <input type="number" class="form-control" id="km" placeholder="Km"
            [(ngModel)]="km" [ngModelOptions]="{standalone: true}" required>
        </div>
        <div class="form-group col-md-2">
          <input type="number" class="form-control" id="meses" placeholder="Meses"
            [(ngModel)]="tempo" [ngModelOptions]="{standalone: true}" required>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(id_marca, id_modelo, item, km, tempo)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  <div [ngClass]="{'loading': loading}"></div>
  `
})
export class ModalManualEditComponent {
  @Input() id_marca;
  @Input() id_modelo;
  @Input() id;
  @Input() tempo;
  @Input() km;
  @Input() item;
  @Input() arrMarcas;
  loading = false;
  arrModelos: any;

  constructor(public activeModal: NgbActiveModal, private Veiculo: VeiculoService,
    private notify: SnotifyService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.arrModelos = this.getModelo(this.id_marca);
  }

  edit(id_marca, id_modelo, item, km, tempo) {
    const data = {
      id: this.id,
      id_marca: id_marca,
      id_modelo: id_modelo,
      item: item,
      km: km,
      tempo: tempo
    };
    this.activeModal.close(data);
  }

  getModelo(marca) {
    this.Veiculo.modelos(marca).subscribe(
      result => {
        this.arrModelos = result;
      },
      error => {
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChange(marca) {
    this.getModelo(marca);
  }
}

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  loading = false;
  arrMarcas: any;
  arrModelos: any;
  arrItems: any;
  manualForm: any;
  myControl: any;
  id: any;
  options: any;
  filteredOptions: Observable<string[]>;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal) {
      this.getForm();
  }

  getForm() {
    this.manualForm = new FormGroup({
      km: new FormControl(''),
      meses: new FormControl(''),
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0)
    });

    this.myControl = new FormControl();
  }

  ngOnInit() {
    this.loading = true;
    this.Veiculo.marcas().subscribe(
      result => {
        this.arrMarcas = result;
      },
      error => {
        this.notify.error('Erro ao retornar as marcas dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );

    this.getItems();

    this.Manual.getOptions().subscribe(
      result => {
        this.loading = false;
        this.setOptions(result);
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  getItems() {
    this.Manual.items().subscribe(
      result => {
        this.arrItems = result;
      },
      error => {
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  setOptions(options) {
    this.options = options;

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value) {
    let filterValue = '';
    if (value && value.hasOwnProperty('item')) {
      filterValue = value.item.toLowerCase();
    } else {
      filterValue = value.toLowerCase();
    }

    return this.options.filter(option => option.item.toLowerCase().includes(filterValue));
  }

  displayFn(item) {
    if (item) { return item.item; }
  }

  onChange() {
    this.loading = true;
    this.Veiculo.modelos(this.manualForm.value.selectedMarca).subscribe(
      result => {
        this.loading = false;
        this.arrModelos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return this.myControl.value && this.manualForm.value.km && this.manualForm.value.meses
    && !(this.manualForm.value.selectedMarca === 0) && !(this.manualForm.value.selectedModelo === 0);
  }

  onSubmit() {
    let item = '';
    let id = '';
    if (typeof(this.myControl.value) !== 'object') {
      item = this.myControl.value;
      id = null;
    } else {
      item = this.myControl.value.item;
      id = this.myControl.value.id;
    }

    const data = {
      selectedModelo: this.manualForm.value.selectedModelo,
      selectedMarca: this.manualForm.value.selectedMarca,
      km: this.manualForm.value.km,
      meses: this.manualForm.value.meses,
      id: id,
      item: item
    };

    this.loading = true;
    this.Manual.save(data).subscribe(
      result => {
        this.getForm();
        this.getItems();
        this.loading = false;
        this.notify.success(result['data'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.getForm();
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  remove() {
    this.Manual.remove(this.id).subscribe(
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

  openEdit(id, item, id_marca, id_modelo, km, tempo) {
    const modalRef = this.modalService.open(ModalManualEditComponent, { size: 'lg' });
    modalRef.componentInstance.id_marca = id_marca;
    modalRef.componentInstance.id_modelo = id_modelo;
    modalRef.componentInstance.km = km;
    modalRef.componentInstance.tempo = tempo;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.arrMarcas = this.arrMarcas;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Manual.edit(data).subscribe(
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
