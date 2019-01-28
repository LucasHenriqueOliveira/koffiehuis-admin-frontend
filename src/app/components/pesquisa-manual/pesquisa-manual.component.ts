import { Component, OnInit, Input } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-pesquisa-manual-edit-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar Item do Manual</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-8">
          <select id="inputItens" class="form-control" [(ngModel)]="id_manual" [ngModelOptions]="{standalone: true}" required>
            <option *ngFor="let item of arrItensManual" [value]="item.id">{{item.item}}</option>
          </select>
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
      <button type="button" (click)="edit(id_manual, km, tempo)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  <div [ngClass]="{'loading': loading}"></div>
  `
})
export class ModalPesquisaManualEditComponent {
  @Input() id_marca;
  @Input() id_modelo;
  @Input() id;
  @Input() tempo;
  @Input() km;
  @Input() id_manual;
  loading = false;
  arrItensManual: any;

  constructor(public activeModal: NgbActiveModal, private Manual: ManualService,
    private notify: SnotifyService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.arrItensManual = this.getItensManual();
  }

  edit(id_manual, km, tempo) {
    const data = {
      id: this.id,
      id_marca: this.id_marca,
      id_modelo: this.id_modelo,
      id_manual: id_manual,
      km: km,
      tempo: tempo
    };
    this.activeModal.close(data);
  }

  getItensManual() {
    this.Manual.itensManual().subscribe(
      result => {
        this.arrItensManual = result;
      },
      error => {
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }
}

@Component({
  selector: 'app-pesquisa-manual',
  templateUrl: './pesquisa-manual.component.html',
  styleUrls: ['./pesquisa-manual.component.css']
})
export class PesquisaManualComponent implements OnInit {

  loading = false;
  pesquisa = false;
  arrMarcas: any;
  arrModelos: any;
  arrItens: any = [];
  id_marca: any;
  id_modelo: any;
  ano: any;
  id_versao: any;
  manualForm = new FormGroup({
    selectedMarca: new FormControl(0),
    selectedModelo: new FormControl(0)
  });

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal) {
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

    this.lastManual();
  }

  lastManual() {
    this.Manual.lastManual().subscribe(
      result => {
        this.arrItens = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
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

  onSubmit() {
    this.loading = true;
    this.Manual.listManual(this.manualForm.value.selectedModelo).subscribe(
      result => {
        this.arrItens = result;
        this.loading = false;
        this.pesquisa = true;
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id_marca, id_modelo, ano, id_versao) {
    this.id_marca = id_marca;
    this.id_modelo = id_modelo;
    this.ano = ano;
    this.id_versao = id_versao;
    this.modalService.open(content);
  }

  remove() {
    this.Manual.removeManualCarro(this.id_marca, this.id_modelo, this.ano, this.id_versao).subscribe(
      result => {
        this.loading = false;
        this.arrItens = result['data'];
        if (!this.arrItens.length) {
          this.lastManual();
        }
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

  openEdit(id_manual, id, id_marca, id_modelo, km, tempo) {
    const modalRef = this.modalService.open(ModalPesquisaManualEditComponent, { size: 'lg' });
    modalRef.componentInstance.id_marca = id_marca;
    modalRef.componentInstance.id_modelo = id_modelo;
    modalRef.componentInstance.km = km;
    modalRef.componentInstance.tempo = tempo;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.id_manual = id_manual;

    modalRef.result.then((result) => {
      this.edit(result);
    }).catch((error) => {
    });
  }

  edit(data) {
    this.Manual.editManualCarro(data).subscribe(
      result => {
        this.loading = false;
        this.arrItens = result['data'];
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
