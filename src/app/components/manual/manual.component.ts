import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { TituloService } from 'src/app/services/titulo.service';


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
  removeItemId: any;
  modalReference: any;
  filteredOptions: Observable<string[]>;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private modalService: NgbModal,
    private Titulo: TituloService) {
      this.getForm();
  }

  getForm() {
    this.manualForm = new FormGroup({
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0),
      selectedAno: new FormControl(0),
      selectedVersao: new FormControl(0),
      selectedTitulo: new FormControl(0),
      observacao: new FormControl('')
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

    const data = {
      selectedModelo: this.manualForm.value.selectedModelo,
      selectedMarca: this.manualForm.value.selectedMarca,
      selectedAno: this.manualForm.value.selectedAno,
      selectedVersao: this.manualForm.value.selectedVersao,
      observacao: this.manualForm.value.observacao,
      itens: arr
    };

    this.loading = true;
    this.Manual.save(data).subscribe(
      result => {
        this.getForm();
        this.resetForm();
        this.arrayItems = [];
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
