import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { VeiculoService } from '../../services/veiculo.service';
import { ManualService } from '../../services/manual.service';

@Component({
  selector: 'app-copia-manual',
  templateUrl: './copia-manual.component.html',
  styleUrls: ['./copia-manual.component.css']
})
export class CopiaManualComponent implements OnInit {

  loading = false;
  pesquisa = false;
  arrMarcas: any;
  arrModelos: any;
  arrMarcas2: any;
  arrModelos2: any;
  arrItens: any = [];
  id: any;
  manualForm: any;
  copiaManualForm: any;

  constructor(private Veiculo: VeiculoService,
    private notify: SnotifyService,
    private Manual: ManualService) {
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
      selectedModelo: new FormControl(0)
    });
    this.copiaManualForm = new FormGroup({
      selectedMarca2: new FormControl(0),
      selectedModelo2: new FormControl(0)
    });
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
    return !(this.manualForm.value.selectedMarca === 0) && !(this.manualForm.value.selectedModelo === 0);
  }

  checkButton2() {
    return !(this.copiaManualForm.value.selectedMarca2 === 0) && !(this.copiaManualForm.value.selectedModelo2 === 0);
  }

  onSubmit() {
    this.loading = true;
    this.Manual.manualCarro(this.manualForm.value.selectedModelo).subscribe(
      result => {
        this.arrItens = result;
        this.loading = false;
        this.pesquisa = true;
      },
      error => {
        this.loading = false;
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }

  onSubmit2() {
    const data = {
      selectedMarca: this.copiaManualForm.value.selectedMarca2,
      selectedModelo: this.copiaManualForm.value.selectedModelo2,
      itens: this.arrItens
    };
    this.loading = true;
    this.Manual.saveManualCarro(data).subscribe(
      result => {
        this.arrItens = [];
        this.getForm();
        this.loading = false;
        this.pesquisa = false;
        this.notify.success(result['message'], {timeout: 2000, showProgressBar: false });
      },
      error => {
        this.loading = false;
        this.notify.error(error.error, {timeout: 3000, showProgressBar: false });
      }
    );
  }
}
