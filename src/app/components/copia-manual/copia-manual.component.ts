import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-copia-manual',
  templateUrl: './copia-manual.component.html',
  styleUrls: ['./copia-manual.component.css']
})
export class CopiaManualComponent implements OnInit {

  loading = false;
  pesquisa = false;
  copy = false;
  arrMarcas: any;
  arrModelos: any;
  arrAnos: any;
  arrVersoes: any;
  arrMarcas2: any;
  arrModelos2: any;
  arrAnos2: any;
  arrVersoes2: any;
  arrItens: any = [];
  arrCarros: any = [];
  id: any;
  manualForm: any;
  manualCompleto: any;
  copiaManualForm: any;
  marca: any;
  modelo: any;
  versao: any;
  marcaAntigo: any;
  modeloAntigo: any;
  anoAntigo: any;
  versaoAntigo: any;
  ano_txt: any;
  selectedRow: any = null;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService,
    private router: Router) {
      this.getForm();
    }

  ngOnInit() {
    this.loading = true;
    this.Veiculo.marcas().subscribe(
      result => {
        this.arrMarcas = result;
        this.arrMarcas2 = result;
        this.loading = false;
      },
      error => {
        this.notify.error('Erro ao retornar as marcas dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  getForm() {
    this.manualForm = new FormGroup({
      selectedMarca: new FormControl(0),
      selectedModelo: new FormControl(0),
      selectedAno: new FormControl(0),
      selectedVersao: new FormControl(0)
    });
    this.copiaManualForm = new FormGroup({
      selectedMarca2: new FormControl(0),
      selectedModelo2: new FormControl(0),
      selectedAno2: new FormControl(0),
      selectedVersao2: new FormControl(0)
    });
  }

  onChangeMarca(event: Event, status) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.marca = selectElementText;

    this.loading = true;
    let selectMarca = '';
    if (status === 1) {
      selectMarca = this.manualForm.value.selectedMarca;
    } else {
      selectMarca = this.copiaManualForm.value.selectedMarca2;
    }
    this.Veiculo.modelos(selectMarca).subscribe(
      result => {
        this.loading = false;
        if (status === 1) {
          this.arrModelos = result;
          this.manualForm.value.selectedAno = 0;
          this.manualForm.value.selectedVersao = 0;
        } else {
          this.arrModelos2 = result;
          this.copiaManualForm.value.selectedAno2 = 0;
          this.copiaManualForm.value.selectedVersao2 = 0;
        }
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeModelo(event: Event, status) {
    const selectedOptions = event['target']['options'];
    const selectedIndex = selectedOptions.selectedIndex;
    const selectElementText = selectedOptions[selectedIndex].text;
    this.modelo = selectElementText;

    this.loading = true;
    let selectModelo = '';
    if (status === 1) {
      selectModelo = this.manualForm.value.selectedModelo;
    } else {
      selectModelo = this.copiaManualForm.value.selectedModelo2;
    }
    this.Veiculo.anos(selectModelo).subscribe(
      result => {
        this.loading = false;
        if (status === 1) {
          this.arrAnos = result;
          this.manualForm.value.selectedVersao = 0;
        } else {
          this.arrAnos2 = result;
          this.copiaManualForm.value.selectedVersao2 = 0;
        }
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os anos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onChangeAno(event: Event, status) {
    this.loading = true;
    let selectAno = '';
    if (status === 1) {
      selectAno = this.manualForm.value.selectedAno;
    } else {
      const selectedOptions = event['target']['options'];
      const selectedIndex = selectedOptions.selectedIndex;
      const selectElementText = selectedOptions[selectedIndex].text;
      this.ano_txt = selectElementText;
      selectAno = this.copiaManualForm.value.selectedAno2;
    }
    this.Veiculo.versoes(selectAno).subscribe(
      result => {
        this.loading = false;
        if (status === 1) {
          this.arrVersoes = result;
        } else {
          this.arrVersoes2 = result;
        }
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
    this.versao = selectElementText;
  }

  onChange2() {
    this.loading = true;
    this.Veiculo.modelos(this.copiaManualForm.value.selectedMarca2).subscribe(
      result => {
        this.loading = false;
        this.arrModelos2 = result;
      },
      error => {
        this.loading = false;
        this.notify.error('Erro ao retornar os modelos dos veículos', {timeout: 3000, showProgressBar: false });
      }
    );
  }

  checkButton() {
    return !(this.manualForm.value.selectedMarca === 0) || !(this.manualForm.value.selectedModelo === 0) ||
      !(this.manualForm.value.selectedAno === 0) || !(this.manualForm.value.selectedVersao === 0);
  }

  checkButton2() {
    return !(this.copiaManualForm.value.selectedMarca2 === 0) && !(this.copiaManualForm.value.selectedModelo2 === 0) &&
      !(this.copiaManualForm.value.selectedAno2 === 0) && !(this.copiaManualForm.value.selectedVersao2 === 0);
  }

  onSubmit() {
    this.loading = true;
    const data = {
      selectedMarca: this.manualForm.value.selectedMarca,
      selectedModelo: this.manualForm.value.selectedModelo,
      selectedAno: this.manualForm.value.selectedAno,
      selectedVersao: this.manualForm.value.selectedVersao
    };
    this.Manual.getManualCarro(data).subscribe(
      result => {
        this.arrCarros = result;
        this.loading = false;
        this.pesquisa = true;
      },
      error => {
        this.loading = false;
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  openCopy(marca, modelo, ano_txt, ano, versao, index) {
    this.copy = true;
    this.marcaAntigo = marca;
    this.modeloAntigo = modelo;
    this.anoAntigo = ano;
    this.ano_txt = ano_txt;
    this.versaoAntigo = versao;
    this.selectedRow = index;
  }

  copiar() {
    const data = {
      selectedMarca: this.copiaManualForm.value.selectedMarca2,
      selectedModelo: this.copiaManualForm.value.selectedModelo2,
      selectedAno: this.copiaManualForm.value.selectedAno2,
      selectedVersao: this.copiaManualForm.value.selectedVersao2,
      observacao: this.arrCarros['observacao'],
      marcaAntigo: this.marcaAntigo,
      modeloAntigo: this.modeloAntigo,
      anoAntigo: this.anoAntigo,
      versaoAntigo: this.versaoAntigo
    };

    this.loading = true;
    this.Manual.copy(data).subscribe(
      result => {
        this.arrCarros = [];
        this.getForm();
        this.loading = false;
        this.copy = false;
        this.pesquisa = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  alterar() {

    const data = {
      selectedMarca: this.copiaManualForm.value.selectedMarca2,
      selectedModelo: this.copiaManualForm.value.selectedModelo2,
      selectedAno: this.copiaManualForm.value.selectedAno2,
      selectedVersao: this.copiaManualForm.value.selectedVersao2,
      observacao: this.arrCarros['observacao'],
      marcaAntigo: this.marcaAntigo,
      modeloAntigo: this.modeloAntigo,
      anoAntigo: this.anoAntigo,
      versaoAntigo: this.versaoAntigo
    };

    this.loading = true;
    this.Manual.copy(data).subscribe(
      result => {
        this.loading = false;
        this.notify.success('Os dados foram copiados. Favor realizar a alteração.', {timeout: 2000, showProgressBar: false });
        this.Manual.setLocal(this.marca, this.modelo, this.ano_txt, this.copiaManualForm.value.selectedAno2, this.versao);
        this.router.navigate(['/manual-carro'],  { queryParams: { id_marca: this.copiaManualForm.value.selectedMarca2,
          id_modelo: this.copiaManualForm.value.selectedModelo2, ano: this.copiaManualForm.value.selectedAno2,
          id_versao: this.copiaManualForm.value.selectedVersao2} });
      },
      error => {
        this.loading = false;
        this.notify.error(error.error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }
}
