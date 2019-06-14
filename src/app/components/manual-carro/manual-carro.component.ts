import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { ManualService } from '../../services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TituloService } from 'src/app/services/titulo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FluidoService } from 'src/app/services/fluido.service';
import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-fluido-edit-manual-carro-modal',
  template: `
  <form>
    <div class="modal-header">
      <h4 class="modal-title">Editar fluido</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group col-md-12">
          <select id="inputFluido" ngbAutofocus class="form-control"
          [(ngModel)]="id_fluido" [ngModelOptions]="{standalone: true}">
            <option *ngFor="let fluido of arrFluidos" [value]="fluido.id">{{fluido.nome}}</option>
          </select>
        </div>
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="descricao_fluido1"
          [ngModelOptions]="{standalone: true}" placeholder="Descrição 1">
        </div>
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="descricao_fluido2"
          [ngModelOptions]="{standalone: true}" placeholder="Descrição 2">
        </div>
        <div class="form-group col-md-12">
          <input type="text" class="form-control" [(ngModel)]="descricao_fluido3"
          [ngModelOptions]="{standalone: true}" placeholder="Descrição 3">
        </div>
        <div class="form-group col-sm-12">
          <input type="text" class="form-control" [(ngModel)]="litros_fluido"
          [ngModelOptions]="{standalone: true}" name="litros_fluido" placeholder="Litros">
        </div>
        <div class="form-group col-sm-12">
          <textarea class="form-control" rows="3" [(ngModel)]="observacao_fluido"
          [ngModelOptions]="{standalone: true}" placeholder="Observação"></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="activeModal.dismiss('cancel click')">Cancelar</button>
      <button type="button" (click)="edit(id_fluido, descricao_fluido1, descricao_fluido2, descricao_fluido3,
        litros_fluido, observacao_fluido)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalFluidoEditManualCarroComponent {
  @Input() arrFluidos;
  @Input() id;
  @Input() id_fluido;
  @Input() nome;
  @Input() descricao_fluido1;
  @Input() descricao_fluido2;
  @Input() descricao_fluido3;
  @Input() litros_fluido;
  @Input() observacao_fluido;
  txtFluidoNome: any;

  constructor(public activeModal: NgbActiveModal) {}

  edit(id_fluido, descricao_fluido1, descricao_fluido2, descricao_fluido3, litros_fluido, observacao_fluido) {

    for (let i = 0; i < this.arrFluidos.length; i++) {
      if (this.arrFluidos[i]['id'] === parseInt(id_fluido, 10)) {
        this.txtFluidoNome = this.arrFluidos[i]['nome'];
      }
    }

    const data = {
      id: this.id,
      id_fluido: id_fluido,
      nome: this.txtFluidoNome,
      descricao1: descricao_fluido1,
      descricao2: descricao_fluido2,
      descricao3: descricao_fluido3,
      litros: litros_fluido,
      observacao: observacao_fluido
    };
    this.activeModal.close(data);
  }
}

@Component({
  selector: 'app-manual-carro',
  templateUrl: './manual-carro.component.html',
  styleUrls: ['./manual-carro.component.css']
})
export class ManualCarroComponent implements OnInit {

  id_marca: any;
  id_modelo: any;
  ano: any;
  id_versao: any;
  loading = false;
  arrItems: any = [];
  arrItemsFixo: any = [];
  arrTitulos: any = [];
  arrInfo: any = [];
  arrFluidos: any = [];
  arrFluidosGeral: any = [];
  options: any = [];
  marca: any;
  modelo: any;
  versao: any;
  observacao: any;
  observacao_fluido: any;
  id: any;
  id_fluido: any;
  selectedTitulo: any;
  itemForm: any;
  km_ideal: any;
  meses_ideal: any;
  observacao_ideal: any;
  km_severo: any;
  meses_severo: any;
  observacao_severo: any;
  cabine: any;
  roda_raio: any;
  pneu_medida: any;
  normal_dianteira_calibragem_psi: any;
  normal_traseira_calibragem_psi: any;
  completa_dianteira_calibragem_psi: any;
  completa_traseira_calibragem_psi: any;
  estepe_calibragem_psi: any;
  observacao_info: any;
  tipo_fluido = 0;
  descricao_fluido1: any;
  descricao_fluido2: any;
  descricao_fluido3: any;
  litros_fluido: any;
  observacao_fluido_unit: any;
  tipo: any;
  inputObservacao: any;
  selectedCabine: any;
  inputRodaRaio: any;
  inputPneuMedida: any;
  inputNormalTraseiraCalibragemPsi: any;
  inputNormalDianteiraCalibragemPsi: any;
  inputCompletaTraseiraCalibragemPsi: any;
  inputCompletaDianteiraCalibragemPsi: any;
  inputEstepeCalibragemPsi: any;
  km_ideal_edit: any;
  meses_ideal_edit: any;
  observacao_ideal_edit: any;
  km_severo_edit: any;
  meses_severo_edit: any;
  observacao_severo_edit: any;
  id_manual_carro: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal,
    private Titulo: TituloService,
    private Fluido: FluidoService) {

      this.getForm();
  }

  getForm() {
    this.itemForm = new FormGroup({
      selectedTitulo: new FormControl(0),
      selectedItem: new FormControl(0)
    });
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.id_marca = params['id_marca'];
        this.id_modelo = params['id_modelo'];
        this.ano = params['ano'];
        this.id_versao = params['id_versao'];
      });

      this.loading = true;
      this.Manual.manualCarro(this.id_marca, this.id_modelo, this.ano, this.id_versao).subscribe(
        result => {
          this.arrItems = result['manual'];
          this.arrItemsFixo = result['manual_fixo'];
          this.carroInfo(result['manual_info'], result['manual_fluido']);
          this.observacao = result['observacao'];
          this.observacao_fluido = result['observacao_fluido'];
          this.loading = false;
        },
        error => {
          this.notify.error('Erro ao retornar o manual do veículo', {timeout: 3000, showProgressBar: false });
        }
      );

      const arr = this.Manual.getLocal();
      this.marca = arr['marca'];
      this.modelo = arr['modelo'];
      this.ano = arr['ano'];
      this.versao = arr['versao'];
  }

  carroInfo(info, fluidos) {
    this.cabine = info['cabine'];
    this.roda_raio = info['roda_raio'];
    this.pneu_medida = info['pneu_medida'];
    this.normal_dianteira_calibragem_psi = info['normal_dianteira_calibragem_psi'];
    this.normal_traseira_calibragem_psi = info['normal_traseira_calibragem_psi'];
    this.completa_dianteira_calibragem_psi = info['completa_dianteira_calibragem_psi'];
    this.completa_traseira_calibragem_psi = info['completa_traseira_calibragem_psi'];
    this.estepe_calibragem_psi = info['estepe_calibragem_psi'];
    this.observacao_info = info['observacao_geral'];
    this.arrFluidos = fluidos;
  }

  backbutton() {
    window.history.back();
  }

  editarFluido(fluido) {
    this.Fluido.fluido().subscribe(
      result => {
        const modalRef = this.modalService.open(ModalFluidoEditManualCarroComponent);
        modalRef.componentInstance.arrFluidos = result;
        modalRef.componentInstance.id = fluido.id_manual_carro_fluido;
        modalRef.componentInstance.id_fluido = fluido.id_fluido;
        modalRef.componentInstance.nome = fluido.nome;
        modalRef.componentInstance.descricao_fluido1 = fluido.descricao1;
        modalRef.componentInstance.descricao_fluido2 = fluido.descricao2;
        modalRef.componentInstance.descricao_fluido3 = fluido.descricao3;
        modalRef.componentInstance.litros_fluido = fluido.litros;
        modalRef.componentInstance.observacao_fluido = fluido.observacao;

        modalRef.result.then((data) => {
          this.editFluido(data);
        }).catch((error) => {
        });
      },
      error => {
        this.notify.error('Erro ao retornar o fluído', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  editFluido(data) {
    data['marca'] = this.id_marca;
    data['modelo'] = this.id_modelo;
    data['ano'] = this.ano;
    data['versao'] = this.id_versao;

    this.loading = true;
    this.Fluido.editFluidoCarro(data).subscribe(
      result => {
        this.loading = false;
        this.arrFluidos = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.notify.error('Erro ao retornar o fluído', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  edit() {

    const arr = [];
    for (let i = 0; i < this.arrItems.length; i++) {
      for (let m = 0; m < this.arrItems[i]['items'].length; m++) {
        arr.push({id: this.arrItems[i]['items'][m]['id'],
        km_ideal: (document.getElementById('km_ideal_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        meses_ideal: (document.getElementById('meses_ideal_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        observacao_ideal: (document.getElementById('observacao_ideal_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        km_severo: (document.getElementById('km_severo_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        meses_severo: (document.getElementById('meses_severo_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value,
        observacao_severo: (document.getElementById('observacao_severo_' + this.arrItems[i]['items'][m].id) as HTMLInputElement).value});
      }
    }

    const data = {
      marca: this.id_marca,
      modelo: this.id_modelo,
      ano: this.ano,
      versao: this.id_versao,
      observacao: (document.getElementById('observacao') as HTMLInputElement).value,
      itens: arr
    };

    this.loading = true;
    this.Manual.editManualCarro(data).subscribe(
      result => {
        this.loading = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemoveFluido(content, id) {
    this.id_fluido = id;
    this.modalService.open(content);
  }

  removeFluido() {
    this.loading = true;
    const data = {
      id: this.id_fluido,
      marca: this.id_marca,
      modelo: this.id_modelo,
      ano: this.ano,
      versao: this.id_versao
    };
    this.Fluido.removeFluidoCarro(data).subscribe(
      result => {
        this.loading = false;
        this.modalService.dismissAll();
        this.arrFluidos = result['data'];
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error('Erro ao excluir o fluido', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRemove(content, id) {
    this.id = id;
    this.modalService.open(content);
  }

  removeItem() {
    this.loading = true;
    this.Manual.removeItemManualCarro(this.id, this.id_marca, this.id_modelo, this.ano, this.id_versao).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data']['manual'];
        this.arrItemsFixo = result['data']['manual_fixo'];
        this.observacao = result['data']['observacao'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openObservacao(content, text, tipo) {
    this.tipo = tipo;
    this.inputObservacao = text;
    this.modalService.open(content);
  }

  editObservacao() {
    const data = {
      id_marca: this.id_marca,
      id_modelo: this.id_modelo,
      ano: this.ano,
      id_versao: this.id_versao,
      observacao: this.inputObservacao
    };

    if (this.tipo === 'fluido') {
      this.loading = true;
      this.Fluido.editObservacaoFluidoCarro(data).subscribe(
        result => {
          this.loading = false;
          this.modalService.dismissAll();
          this.observacao_fluido = result['data'];
          this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
        },
        error => {
          this.loading = false;
          this.modalService.dismissAll();
          this.notify.error('Erro ao alterar a observação', {timeout: 3000, showProgressBar: false });
        }
      );
    } else if (this.tipo === 'pneus') {
      this.Manual.editObservacaoInfo(data).subscribe(
        result => {
          this.loading = false;
          this.modalService.dismissAll();
          this.observacao_info = result['data'];
          this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
        },
        error => {
          this.loading = false;
          this.modalService.dismissAll();
          this.notify.error('Erro ao alterar a observação', {timeout: 3000, showProgressBar: false });
        }
      );
    } else if (this.tipo === 'geral') {
      this.Manual.editObservacaoGeral(data).subscribe(
        result => {
          this.loading = false;
          this.modalService.dismissAll();
          this.observacao = result['data'];
          this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
        },
        error => {
          this.loading = false;
          this.modalService.dismissAll();
          this.notify.error('Erro ao alterar a observação', {timeout: 3000, showProgressBar: false });
        }
      );
    }
  }

  openFluido(content) {
    this.Fluido.fluido().subscribe(
      result => {
        this.arrFluidosGeral = result;
        this.modalService.open(content);
      },
      error => {
        this.notify.error('Erro ao retornar o fluído', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  addFluido() {
    const data = {
      id_marca: this.id_marca,
      id_modelo: this.id_modelo,
      ano: this.ano,
      id_versao: this.id_versao,
      id_fluido: this.tipo_fluido,
      descricao1: this.descricao_fluido1,
      descricao2: this.descricao_fluido2,
      descricao3: this.descricao_fluido3,
      litros: this.litros_fluido,
      observacao: this.observacao_fluido_unit
    };

    this.loading = true;
    this.Fluido.addFluidoCarro(data).subscribe(
      result => {
        this.loading = false;
        this.arrFluidos = result['data'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.modalService.dismissAll();
        this.notify.error('Erro ao salvar o fluído', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openRodas(content) {
    this.selectedCabine = this.cabine;
    this.inputRodaRaio = this.roda_raio;
    this.inputPneuMedida = this.pneu_medida;
    this.inputNormalTraseiraCalibragemPsi = this.normal_traseira_calibragem_psi;
    this.inputNormalDianteiraCalibragemPsi = this.normal_dianteira_calibragem_psi;
    this.inputCompletaTraseiraCalibragemPsi = this.completa_traseira_calibragem_psi;
    this.inputCompletaDianteiraCalibragemPsi = this.completa_dianteira_calibragem_psi;
    this.inputEstepeCalibragemPsi = this.estepe_calibragem_psi;
    this.modalService.open(content, { size: 'lg'});
  }

  editRodas() {
    const data = {
      cabine: this.selectedCabine,
      roda_raio: this.inputRodaRaio,
      pneu_medida: this.inputPneuMedida,
      normal_dianteira_calibragem_psi: this.inputNormalDianteiraCalibragemPsi,
      normal_traseira_calibragem_psi: this.inputNormalTraseiraCalibragemPsi,
      completa_dianteira_calibragem_psi: this.inputCompletaDianteiraCalibragemPsi,
      completa_traseira_calibragem_psi: this.inputCompletaTraseiraCalibragemPsi,
      estepe_calibragem_psi: this.inputEstepeCalibragemPsi,
      id_marca: this.id_marca,
      id_modelo: this.id_modelo,
      ano: this.ano,
      id_versao: this.id_versao
    };

    this.loading = true;
    this.Manual.editRodas(data).subscribe(
      result => {
        this.loading = false;
        this.cabine = result['data']['cabine'];
        this.roda_raio = result['data']['roda_raio'];
        this.pneu_medida = result['data']['pneu_medida'];
        this.normal_dianteira_calibragem_psi = result['data']['normal_dianteira_calibragem_psi'];
        this.normal_traseira_calibragem_psi = result['data']['normal_traseira_calibragem_psi'];
        this.completa_dianteira_calibragem_psi = result['data']['completa_dianteira_calibragem_psi'];
        this.completa_traseira_calibragem_psi = result['data']['completa_traseira_calibragem_psi'];
        this.estepe_calibragem_psi = result['data']['estepe_calibragem_psi'];
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.modalService.dismissAll();
        this.notify.error('Erro ao editar rodas', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openItem(content) {
    this.modalService.open(content, { size: 'lg'});
    this.Titulo.titulo().subscribe(
      result => {
        this.arrTitulos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o título', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeTitulo() {
    this.Manual.itensManualTitulo(this.itemForm.value.selectedTitulo).subscribe(
      result => {
        this.options = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  editarItem(content, item) {
    this.id_manual_carro = item.id_manual_carro;
    this.km_ideal_edit = item.km_ideal;
    this.meses_ideal_edit = item.meses_ideal;
    this.observacao_ideal_edit = item.observacao_ideal;
    this.km_severo_edit = item.km_severo;
    this.meses_severo_edit = item.meses_severo;
    this.observacao_severo_edit = item.observacao_severo;
    this.modalService.open(content);
  }

  editItem() {
    const data = {
      id: this.id_manual_carro,
      id_marca: this.id_marca,
      id_modelo: this.id_modelo,
      ano: this.ano,
      id_versao: this.id_versao,
      km_ideal: this.km_ideal_edit,
      meses_ideal: this.meses_ideal_edit,
      observacao_ideal: this.observacao_ideal_edit,
      km_severo: this.km_severo_edit,
      meses_severo: this.meses_severo_edit,
      observacao_severo: this.observacao_severo_edit
    };

    this.Manual.editItemManualTitulo(data).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data']['manual'];
        this.arrItemsFixo = result['data']['manual_fixo'];
        this.getForm();
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  addItem(km_ideal, meses_ideal, observacao_ideal, km_severo, meses_severo, observacao_severo) {
    const data = {
      km_ideal: km_ideal,
      meses_ideal: meses_ideal,
      observacao_ideal: observacao_ideal,
      km_severo: km_severo,
      meses_severo: meses_severo,
      observacao_severo: observacao_severo,
      marca: this.id_marca,
      modelo: this.id_modelo,
      ano: this.ano,
      versao: this.id_versao,
      item: this.itemForm.value.selectedItem
    };

    this.Manual.saveItemManualTitulo(data).subscribe(
      result => {
        this.loading = false;
        this.arrItems = result['data']['manual'];
        this.arrItemsFixo = result['data']['manual_fixo'];
        this.observacao = result['data']['observacao'];
        this.getForm();
        this.km_ideal = '';
        this.meses_ideal = '';
        this.observacao_ideal = '';
        this.km_severo = '';
        this.meses_severo = '';
        this.observacao_severo = '';
        this.modalService.dismissAll();
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.modalService.dismissAll();
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

}
