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
  arrayItems: any = [];
  manualForm: any;
  id: any;
  options: any;
  itens = {};
  km = {};
  meses = {};
  filteredOptions: Observable<string[]>;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal) {
      this.getForm();
  }

  getForm() {
    this.manualForm = new FormGroup({
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0)
    });
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

    this.Manual.itensManual().subscribe(
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

  setOptions(options) {
    this.options = options;
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
    return !(this.manualForm.value.selectedMarca === 0) && !(this.manualForm.value.selectedModelo === 0);
  }

  setItens(id, checked) {
    if (checked) {
      this.arrayItems.push(id);
      (document.getElementById('div_km_' + id) as HTMLInputElement).style.display = 'inline-block';
      (document.getElementById('div_meses_' + id) as HTMLInputElement).style.display = 'inline-block';
    } else {
      const indexArrayItems = this.arrayItems.indexOf(id);
      if (indexArrayItems > -1) {
        this.arrayItems.splice(indexArrayItems, 1);
      }
      (document.getElementById('div_km_' + id) as HTMLInputElement).style.display = 'none';
      (document.getElementById('div_meses_' + id) as HTMLInputElement).style.display = 'none';
    }
  }

  onSubmit() {
    const arr = [];
    for (let i = 0; i < this.arrayItems.length; i++) {
      const km = (document.getElementById('km_' + this.arrayItems[i]) as HTMLInputElement).value;
      const meses = (document.getElementById('meses_' + this.arrayItems[i]) as HTMLInputElement).value;
      arr.push({id: this.arrayItems[i], km: km, meses: meses});
    }
    const data = {
      selectedModelo: this.manualForm.value.selectedModelo,
      selectedMarca: this.manualForm.value.selectedMarca,
      itens: arr
    };

    this.loading = true;
    this.Manual.save(data).subscribe(
      result => {
        this.getForm();
        this.loading = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
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
