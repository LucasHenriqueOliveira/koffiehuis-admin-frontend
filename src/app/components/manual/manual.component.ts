import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { TituloService } from 'src/app/services/titulo.service';
import { FluidoService } from 'src/app/services/fluido.service';

@Component({
  selector: 'app-manual-fluido-edit-modal',
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
          [(ngModel)]="id" [ngModelOptions]="{standalone: true}">
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
      <button type="button" (click)="edit(id, descricao_fluido1, descricao_fluido2, descricao_fluido3,
        litros_fluido, observacao_fluido)" class="btn btn-danger" ngbAutofocus>Editar</button>
    </div>
  </form>
  `
})
export class ModalManualFluidoEditComponent {
  @Input() arrFluidos;
  @Input() id;
  @Input() nome;
  @Input() descricao_fluido1;
  @Input() descricao_fluido2;
  @Input() descricao_fluido3;
  @Input() litros_fluido;
  @Input() observacao_fluido;
  txtFluidoNome: any;

  constructor(public activeModal: NgbActiveModal) {}

  edit(id, descricao_fluido1, descricao_fluido2, descricao_fluido3, litros_fluido, observacao_fluido) {

    for (let i = 0; i < this.arrFluidos.length; i++) {
      if (this.arrFluidos[i]['id'] === parseInt(id, 10)) {
        this.txtFluidoNome = this.arrFluidos[i]['nome'];
      }
    }

    const data = {
      id: id,
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
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  loading = false;
  arrMarcas: any;
  arrModelos: any;
  arrAnos: any;
  arrVersoes: any;
  arrItems: any;
  arrItemsFixo: any;
  arrSelectedItems: any = [];
  arrayItems: any = [];
  arrTitulos: any = [];
  arrFluidos: any = [];
  arrFluidosAdd: any = [];
  manualForm: any;
  id: any;
  options: any;
  itens = {};
  km = {};
  meses = {};
  idItem: any;
  textItem: any;
  km_ideal: any;
  meses_ideal: any;
  observacao_ideal: any;
  km_severo: any;
  meses_severo: any;
  observacao_severo: any;
  tituloExist: boolean;
  txtMarca: any;
  txtModelo: any;
  txtAno: any;
  txtVersao: any;
  txtTitulo: any;
  txtFluidoNome: any;
  removeItemId: any;
  modalReference: any;
  filteredOptions: Observable<string[]>;
  descricao_fluido1: any;
  descricao_fluido2: any;
  descricao_fluido3: any;
  litros_fluido: any;
  observacao_fluido: any;
  tipo_fluido: any = 0;
  index_fluido: any;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal,
    private Titulo: TituloService,
    private Fluido: FluidoService) {
      this.getForm();
  }

  getForm() {
    this.manualForm = new FormGroup({
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0),
      selectedAno: new FormControl(0),
      selectedVersao: new FormControl(0),
      selectedTitulo: new FormControl(0),
      selectedCabine: new FormControl(0),
      observacao: new FormControl(''),
      inputRodaRaio: new FormControl(''),
      inputPneuMedida: new FormControl(''),
      inputNormalTraseiraCalibragemPsi: new FormControl(''),
      inputNormalDianteiraCalibragemPsi: new FormControl(''),
      inputCompletaTraseiraCalibragemPsi: new FormControl(''),
      inputCompletaDianteiraCalibragemPsi: new FormControl(''),
      inputEstepeCalibragemPsi: new FormControl(''),
      observacaoInfo: new FormControl(''),
      observacaoGeralFluido: new FormControl('')
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

    this.Titulo.titulo().subscribe(
      result => {
        this.arrTitulos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o título', {timeout: 3000, showProgressBar: false });
      }
    );

    this.Fluido.fluido().subscribe(
      result => {
        this.arrFluidos = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar o fluído', {timeout: 3000, showProgressBar: false });
      }
    );

    this.Manual.itensManualFixo().subscribe(
      result => {
        this.arrItemsFixo = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual fixo', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  resetFormFluido() {
    this.tipo_fluido = 0;
    this.descricao_fluido1 = '';
    this.descricao_fluido2 = '';
    this.descricao_fluido3 = '';
    this.litros_fluido = '';
    this.observacao_fluido = '';
  }

  setFluidoNome(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtFluidoNome = selectElementText;
  }

  addFluido() {
    this.arrFluidosAdd.push({
      id: Number(this.tipo_fluido),
      nome: this.txtFluidoNome,
      descricao1: this.descricao_fluido1,
      descricao2: this.descricao_fluido2,
      descricao3: this.descricao_fluido3,
      litros: this.litros_fluido,
      observacao: this.observacao_fluido
    });
    this.resetFormFluido();
    this.modalService.dismissAll();
  }

  editarFluido(fluido, index) {
    const modalRef = this.modalService.open(ModalManualFluidoEditComponent);
    modalRef.componentInstance.arrFluidos = this.arrFluidos;
    modalRef.componentInstance.id = fluido.id;
    modalRef.componentInstance.nome = fluido.nome;
    modalRef.componentInstance.descricao_fluido1 = fluido.descricao1;
    modalRef.componentInstance.descricao_fluido2 = fluido.descricao2;
    modalRef.componentInstance.descricao_fluido3 = fluido.descricao3;
    modalRef.componentInstance.litros_fluido = fluido.litros;
    modalRef.componentInstance.observacao_fluido = fluido.observacao;
    this.index_fluido = index;

    modalRef.result.then((result) => {
      this.editFluido(result, this.index_fluido);
    }).catch((error) => {
    });
  }

  editFluido(data, index) {
    this.arrFluidosAdd[index] = data;
  }

  removeFluido(fluido) {
    for (let i = 0; i < this.arrFluidosAdd.length; i++) {
      if (this.arrFluidosAdd[i]['id'] === fluido.id) {
        this.arrFluidosAdd.splice(i, 1);
      }
    }
  }

  setOptions(options) {
    this.options = options;
    this.checkItems(options);
  }

  checkItems(options) {
    for (let t = 0; t < options.length; t++) {
      for (let i = 0; i < this.arrSelectedItems.length; i++) {
        if (Number(this.arrSelectedItems[i]['titulo']) === options[t]['id_titulo']) {
          for (let m = 0; m < this.arrSelectedItems[i]['items'].length; m++) {
            if (Number(this.arrSelectedItems[i]['items'][m]['item']) === options[t]['id']) {
              setTimeout(function() {
                (document.getElementById('check_' + options[t]['id']) as HTMLInputElement).checked = true;
              }, 50);
            }
          }
        }
      }
    }
  }

  onChangeTitulo(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtTitulo = selectElementText;
    this.Manual.itensManualTitulo(this.manualForm.value.selectedTitulo).subscribe(
      result => {
        this.setOptions(result);
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os itens do manual', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeMarca(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtMarca = selectElementText;
    this.loading = true;
    this.Veiculo.modelos(this.manualForm.value.selectedMarca).subscribe(
      result => {
        this.loading = false;
        this.arrModelos = result;
        this.manualForm.value.selectedAno = 0;
        this.manualForm.value.selectedVersao = 0;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeModelo(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtModelo = selectElementText;
    this.loading = true;
    this.Veiculo.anos(this.manualForm.value.selectedModelo).subscribe(
      result => {
        this.loading = false;
        this.arrAnos = result;
        this.manualForm.value.selectedVersao = 0;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os anos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeAno(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtAno = selectElementText;
    this.loading = true;
    this.Veiculo.versoes(this.manualForm.value.selectedAno).subscribe(
      result => {
        this.loading = false;
        this.arrVersoes = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar as versões dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeVersao(event: Event) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.txtVersao = selectElementText;
  }

  checkButton() {
    return !(this.manualForm.value.selectedMarca === 0) && !(this.manualForm.value.selectedModelo === 0);
  }

  openFluido(content) {
    this.modalService.open(content);
  }

  setItens(id, checked, text, content, contentDelete) {
    this.km_ideal = '';
    this.meses_ideal = '';
    this.observacao_ideal = '';
    this.km_severo = '';
    this.meses_severo = '';
    this.observacao_severo = '';

    const titulo = parseInt(this.manualForm.value.selectedTitulo, 10);
    if (titulo === 0) {
      alert('Selecione o título.');
      (document.getElementById('check_' + id) as HTMLInputElement).checked = false;
      return false;
    }
    if (checked) {
      this.arrayItems.push(id);
      this.idItem = id;
      this.textItem = text;
      this.modalService.open(content);
    } else {
      this.removeItemId = id;
      this.modalReference = this.modalService.open(contentDelete);
    }
  }

  cancelRemoveItem() {
    (document.getElementById('check_' + this.removeItemId) as HTMLInputElement).checked = true;
    this.modalReference.close();
  }

  removeItem() {
    for (let i = 0; i < this.arrSelectedItems.length; i++) {
      for (let m = 0; m < this.arrSelectedItems[i]['items'].length; m++) {
        if (this.arrSelectedItems[i]['items'][m]['item'] === this.removeItemId) {
          this.arrSelectedItems[i]['items'].splice(m, 1);
        }
      }
    }
    this.modalReference.close();
  }

  closeItem() {
    const indexArrayItems = this.arrayItems.indexOf(this.idItem);
    (document.getElementById('check_' + this.arrayItems[indexArrayItems]) as HTMLInputElement).checked = false;
    if (indexArrayItems > -1) {
      this.arrayItems.splice(indexArrayItems, 1);
    }
    this.modalService.dismissAll();
  }

  addItem(km_ideal, meses_ideal, observacao_ideal, km_severo, meses_severo, observacao_severo) {
    if (this.arrSelectedItems.length) {
      this.tituloExist = false;
      for (let i = 0; i < this.arrSelectedItems.length; i++) {
        if (this.arrSelectedItems[i]['titulo'] === this.manualForm.value.selectedTitulo) {
          this.arrSelectedItems[i]['items'].push({ item: this.idItem, txtItem: this.textItem,
            km_ideal: km_ideal, meses_ideal: meses_ideal, observacao_ideal: observacao_ideal,
            km_severo: km_severo, meses_severo: meses_severo, observacao_severo: observacao_severo
          });
          this.tituloExist = true;
          break;
        }
      }
      if (!this.tituloExist) {
        this.arrSelectedItems.push({
          titulo: this.manualForm.value.selectedTitulo,
          txtTitulo: this.txtTitulo,
          items: [{ item: this.idItem, txtItem: this.textItem,
            km_ideal: km_ideal, meses_ideal: meses_ideal, observacao_ideal: observacao_ideal,
            km_severo: km_severo, meses_severo: meses_severo, observacao_severo: observacao_severo
          }]
        });
      }
    } else {
      this.arrSelectedItems.push({
        titulo: this.manualForm.value.selectedTitulo,
        txtTitulo: this.txtTitulo,
        items: [{ item: this.idItem, txtItem: this.textItem,
          km_ideal: km_ideal, meses_ideal: meses_ideal, observacao_ideal: observacao_ideal,
          km_severo: km_severo, meses_severo: meses_severo, observacao_severo: observacao_severo
        }]
      });
    }
    this.modalService.dismissAll();
  }

  resetForm() {
    this.arrSelectedItems = [];
    this.txtMarca = '';
    this.txtModelo = '';
    this.txtAno = '';
    this.txtVersao = '';
    this.options = [];
  }

  onSubmit() {

    const arr = [];
    for (let i = 0; i < this.arrSelectedItems.length; i++) {
      for (let m = 0; m < this.arrSelectedItems[i]['items'].length; m++) {
        arr.push({id: this.arrSelectedItems[i]['items'][m]['item'],
        km_ideal: this.arrSelectedItems[i]['items'][m]['km_ideal'],
        meses_ideal: this.arrSelectedItems[i]['items'][m]['meses_ideal'],
        observacao_ideal: this.arrSelectedItems[i]['items'][m]['observacao_ideal'],
        km_severo: this.arrSelectedItems[i]['items'][m]['km_severo'],
        meses_severo: this.arrSelectedItems[i]['items'][m]['meses_severo'],
        observacao_severo: this.arrSelectedItems[i]['items'][m]['observacao_severo']});
      }
    }

    if (!this.manualForm.value.selectedModelo) {
      this.notify.error('Falta selecionar o modelo!', {timeout: 3000, showProgressBar: false });
      return false;
    }

    if (!this.manualForm.value.selectedMarca) {
      this.notify.error('Falta selecionar a marca!', {timeout: 3000, showProgressBar: false });
      return false;
    }

    if (!this.manualForm.value.selectedAno) {
      this.notify.error('Falta selecionar o ano!', {timeout: 3000, showProgressBar: false });
      return false;
    }

    if (!this.manualForm.value.selectedVersao) {
      this.notify.error('Falta selecionar a versão!', {timeout: 3000, showProgressBar: false });
      return false;
    }

    const data = {
      selectedModelo: this.manualForm.value.selectedModelo,
      selectedMarca: this.manualForm.value.selectedMarca,
      selectedAno: this.manualForm.value.selectedAno,
      selectedVersao: this.manualForm.value.selectedVersao,
      observacao: this.manualForm.value.observacao,
      selectedCabine: this.manualForm.value.selectedCabine,
      inputRodaRaio: this.manualForm.value.inputRodaRaio,
      inputPneuMedida: this.manualForm.value.inputPneuMedida,
      inputNormalTraseiraCalibragemPsi: this.manualForm.value.inputNormalTraseiraCalibragemPsi,
      inputNormalDianteiraCalibragemPsi: this.manualForm.value.inputNormalDianteiraCalibragemPsi,
      inputCompletaTraseiraCalibragemPsi: this.manualForm.value.inputCompletaTraseiraCalibragemPsi,
      inputCompletaDianteiraCalibragemPsi: this.manualForm.value.inputCompletaDianteiraCalibragemPsi,
      inputEstepeCalibragemPsi: this.manualForm.value.inputEstepeCalibragemPsi,
      observacaoInfo: this.manualForm.value.observacaoInfo,
      observacaoGeralFluido: this.manualForm.value.observacaoGeralFluido,
      itens: arr,
      fluidos: this.arrFluidosAdd
    };

    console.log(data);

    this.loading = true;
    this.Manual.save(data).subscribe(
      result => {
        this.getForm();
        this.resetForm();
        this.arrayItems = [];
        this.arrFluidosAdd = [];
        this.loading = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }
}
